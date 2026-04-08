import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { generateSecret, generateURI } from 'otplib';
import { verifySync } from '@otplib/totp';
import { crypto as otpCrypto } from '@otplib/plugin-crypto-noble';
import { base32 as otpBase32 } from '@otplib/plugin-base32-scure';

const TWO_FACTOR_ISSUER = 'ULUMAE';
const TWO_FACTOR_PERIOD = 30;
const RECOVERY_CODE_COUNT = 10;
const RECOVERY_CODE_BYTES = 8;

export interface TwoFactorFactorRow {
    id: string;
    user_id: string;
    friendly_name: string;
    secret_ciphertext: string;
    secret_iv: string;
    secret_auth_tag: string;
    verified_at: string | null;
    last_used_at: string | null;
    last_verified_time_step: number | null;
    created_at: string;
}

export interface TwoFactorFactorSummary {
    id: string;
    friendlyName: string;
    status: 'pending' | 'verified';
    createdAt: string;
    verifiedAt: string | null;
    lastUsedAt: string | null;
}

export interface TwoFactorEnforcementStatus {
    enabled: boolean;
    requiresChallenge: boolean;
    trustedSessionExpiresAt: string | null;
    verifiedFactorCount: number;
}

export interface TwoFactorState extends TwoFactorEnforcementStatus {
    factors: TwoFactorFactorSummary[];
    recoveryCodesRemaining: number;
}

function requireSupabaseUrl() {
    const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!value) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured.');
    }
    return value;
}

function requireServiceRoleKey() {
    const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!value) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.');
    }
    return value;
}

function requireTwoFactorMasterKey() {
    const value = process.env.TWO_FACTOR_MASTER_KEY;
    if (!value || value.trim().length < 32) {
        throw new Error('TWO_FACTOR_MASTER_KEY must be set to a long random secret before custom 2FA can be used.');
    }
    return value.trim();
}

function deriveKey(purpose: string) {
    return crypto
        .createHash('sha256')
        .update(`${purpose}:${requireTwoFactorMasterKey()}`, 'utf8')
        .digest();
}

export function createAdminClient() {
    return createClient(requireSupabaseUrl(), requireServiceRoleKey());
}

export function decodeSessionIdFromAccessToken(accessToken?: string | null) {
    if (!accessToken) {
        return null;
    }

    try {
        const [, payload] = accessToken.split('.');
        if (!payload) return null;

        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
        const decoded = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
        return typeof decoded.session_id === 'string' ? decoded.session_id : null;
    } catch {
        return null;
    }
}

export function buildTwoFactorEnrollment(email: string, friendlyName: string) {
    const secret = generateSecret({ length: 20 });
    const otpauthUri = generateURI({
        issuer: TWO_FACTOR_ISSUER,
        label: email,
        secret,
        digits: 6,
        period: TWO_FACTOR_PERIOD,
    });

    return {
        secret,
        otpauthUri,
        friendlyName,
    };
}

export function encryptTwoFactorSecret(secret: string) {
    const key = deriveKey('encryption');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
        ciphertext: ciphertext.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
    };
}

export function decryptTwoFactorSecret(row: Pick<TwoFactorFactorRow, 'secret_ciphertext' | 'secret_iv' | 'secret_auth_tag'>) {
    const key = deriveKey('encryption');
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(row.secret_iv, 'base64')
    );

    decipher.setAuthTag(Buffer.from(row.secret_auth_tag, 'base64'));

    return Buffer.concat([
        decipher.update(Buffer.from(row.secret_ciphertext, 'base64')),
        decipher.final(),
    ]).toString('utf8');
}

export function verifyTwoFactorToken(secret: string, token: string, afterTimeStep?: number | null) {
    const result = verifySync({
        secret,
        token,
        crypto: otpCrypto,
        base32: otpBase32,
        period: TWO_FACTOR_PERIOD,
        epochTolerance: 30,
        afterTimeStep: afterTimeStep ?? undefined,
    });

    return result.valid ? { timeStep: result.timeStep } : null;
}

function formatRecoveryCodeSegment(segment: string) {
    return segment.toUpperCase();
}

export function normalizeRecoveryCode(code: string) {
    return code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function hashRecoveryCodeInternal(normalizedCode: string) {
    return crypto
        .createHmac('sha256', deriveKey('recovery-codes'))
        .update(normalizedCode, 'utf8')
        .digest('hex');
}

export function hashRecoveryCode(code: string) {
    return hashRecoveryCodeInternal(normalizeRecoveryCode(code));
}

export function generateRecoveryCodes() {
    return Array.from({ length: RECOVERY_CODE_COUNT }, () => {
        const raw = crypto.randomBytes(RECOVERY_CODE_BYTES).toString('hex').toUpperCase();
        const formatted = [
            raw.slice(0, 4),
            raw.slice(4, 8),
            raw.slice(8, 12),
            raw.slice(12, 16),
        ]
            .map(formatRecoveryCodeSegment)
            .join('-');

        return {
            plainText: formatted,
            normalized: normalizeRecoveryCode(formatted),
            codeHash: hashRecoveryCodeInternal(normalizeRecoveryCode(formatted)),
            codeHint: formatted.slice(-4),
        };
    });
}

export async function listTwoFactorFactors(
    supabaseAdmin: SupabaseClient,
    userId: string,
    options?: { includeSecrets?: boolean }
) {
    const selection = options?.includeSecrets
        ? 'id,user_id,friendly_name,secret_ciphertext,secret_iv,secret_auth_tag,verified_at,last_used_at,last_verified_time_step,created_at'
        : 'id,user_id,friendly_name,verified_at,last_used_at,last_verified_time_step,created_at';

    const { data, error } = await supabaseAdmin
        .from('user_two_factor_factors')
        .select(selection)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return ((data || []) as unknown) as TwoFactorFactorRow[];
}

export async function getRecoveryCodeCount(supabaseAdmin: SupabaseClient, userId: string) {
    const { count, error } = await supabaseAdmin
        .from('user_two_factor_recovery_codes')
        .select('*', { head: true, count: 'exact' })
        .eq('user_id', userId)
        .is('used_at', null);

    if (error) {
        throw error;
    }

    return count || 0;
}

export async function getTwoFactorEnforcementStatus(
    supabaseAdmin: SupabaseClient,
    userId: string,
    sessionId: string | null
): Promise<TwoFactorEnforcementStatus> {
    const factors = await listTwoFactorFactors(supabaseAdmin, userId);
    const verifiedFactors = factors.filter((factor) => Boolean(factor.verified_at));

    if (!verifiedFactors.length) {
        return {
            enabled: false,
            requiresChallenge: false,
            trustedSessionExpiresAt: null,
            verifiedFactorCount: 0,
        };
    }

    let trustedSessionExpiresAt: string | null = null;

    if (sessionId) {
        const { data, error } = await supabaseAdmin
            .from('user_two_factor_trusted_sessions')
            .select('expires_at')
            .eq('user_id', userId)
            .eq('session_id', sessionId)
            .gt('expires_at', new Date().toISOString())
            .maybeSingle();

        if (error) {
            throw error;
        }

        trustedSessionExpiresAt = data?.expires_at || null;
    }

    return {
        enabled: true,
        requiresChallenge: !trustedSessionExpiresAt,
        trustedSessionExpiresAt,
        verifiedFactorCount: verifiedFactors.length,
    };
}

export async function getTwoFactorState(
    supabaseAdmin: SupabaseClient,
    userId: string,
    sessionId: string | null
): Promise<TwoFactorState> {
    const [factors, enforcementStatus, recoveryCodesRemaining] = await Promise.all([
        listTwoFactorFactors(supabaseAdmin, userId),
        getTwoFactorEnforcementStatus(supabaseAdmin, userId, sessionId),
        getRecoveryCodeCount(supabaseAdmin, userId),
    ]);

    return {
        ...enforcementStatus,
        factors: factors.map((factor) => ({
            id: factor.id,
            friendlyName: factor.friendly_name,
            status: factor.verified_at ? 'verified' : 'pending',
            createdAt: factor.created_at,
            verifiedAt: factor.verified_at,
            lastUsedAt: factor.last_used_at,
        })),
        recoveryCodesRemaining,
    };
}

export async function trustCurrentTwoFactorSession(
    supabaseAdmin: SupabaseClient,
    userId: string,
    sessionId: string,
    sessionExpiresAt: string | null
) {
    const expiresAt = sessionExpiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin
        .from('user_two_factor_trusted_sessions')
        .upsert(
            {
                user_id: userId,
                session_id: sessionId,
                verified_at: new Date().toISOString(),
                expires_at: expiresAt,
            },
            {
                onConflict: 'user_id,session_id',
            }
        );

    if (error) {
        throw error;
    }
}

export async function clearAllTrustedTwoFactorSessions(
    supabaseAdmin: SupabaseClient,
    userId: string
) {
    const { error } = await supabaseAdmin
        .from('user_two_factor_trusted_sessions')
        .delete()
        .eq('user_id', userId);

    if (error) {
        throw error;
    }
}

export async function replaceRecoveryCodes(
    supabaseAdmin: SupabaseClient,
    userId: string
) {
    const recoveryCodes = generateRecoveryCodes();

    const { error: deleteError } = await supabaseAdmin
        .from('user_two_factor_recovery_codes')
        .delete()
        .eq('user_id', userId);

    if (deleteError) {
        throw deleteError;
    }

    const { error: insertError } = await supabaseAdmin
        .from('user_two_factor_recovery_codes')
        .insert(
            recoveryCodes.map((code) => ({
                user_id: userId,
                code_hash: code.codeHash,
                code_hint: code.codeHint,
            }))
        );

    if (insertError) {
        throw insertError;
    }

    return recoveryCodes.map((code) => code.plainText);
}
