// hooks/useAutoSave.ts
// Collections-based auto-save: silently persists memorial data to Supabase
// Saves every 30s on interval + 3s debounce after changes
// Offline-aware: caches to localStorage when disconnected, syncs on reconnect

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MemorialData } from '@/types/memorial';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline' | 'reconnected';

interface UseAutoSaveOptions {
    memorialId: string | null;
    data: MemorialData;
    enabled?: boolean;
    intervalMs?: number;
    debounceMs?: number;
}

interface UseAutoSaveReturn {
    saveStatus: SaveStatus;
    lastSavedAt: Date | null;
    saveNow: () => Promise<void>;
    error: string | null;
}

export function useAutoSave({
    memorialId,
    data,
    enabled = true,
    intervalMs = 30000,
    debounceMs = 3000,
}: UseAutoSaveOptions): UseAutoSaveReturn {
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    const dataRef = useRef(data);
    const lastSavedDataRef = useRef<string>('');
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isSavingRef = useRef(false);

    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    // Serialize collections data for save — strips File objects, keeps serializable data
    const serializeForSave = useCallback((currentData: MemorialData) => {
        return {
            stories: {
                ...currentData.stories,
                profilePhoto: null, // File objects can't be serialized
            },
            media: {
                ...currentData.media,
                coverPhoto: null,
                gallery: currentData.media.gallery.map(g => ({
                    id: g.id,
                    preview: g.preview,
                    caption: g.caption,
                    year: g.year,
                    type: g.type,
                    sha256_hash: g.sha256_hash,
                })),
                childhoodPhotos: currentData.media.childhoodPhotos.map(p => ({
                    preview: p.preview,
                    caption: p.caption,
                    year: p.year,
                })),
                interactiveGallery: currentData.media.interactiveGallery.map(ig => ({
                    id: ig.id,
                    preview: ig.preview,
                    description: ig.description,
                    sha256_hash: ig.sha256_hash,
                })),
                voiceRecordings: currentData.media.voiceRecordings.map(v => ({
                    id: v.id,
                    title: v.title,
                    sha256_hash: v.sha256_hash,
                })),
                videos: currentData.media.videos,
            },
            timeline: currentData.timeline,
            network: {
                ...currentData.network,
                partners: currentData.network.partners.map(p => ({
                    ...p,
                    photo: null,
                })),
            },
            // Denormalized fields for quick queries
            full_name: currentData.stories.fullName || null,
            birth_date: currentData.stories.birthDate || null,
            death_date: currentData.stories.deathDate || null,
        };
    }, []);

    // Core save function
    const performSave = useCallback(async () => {
        if (!memorialId || !enabled || isSavingRef.current) return;

        const currentData = dataRef.current;
        const serializable = serializeForSave(currentData);
        const serialized = JSON.stringify(serializable);

        if (serialized === lastSavedDataRef.current) return;

        // Offline: cache locally
        if (!navigator.onLine) {
            try {
                localStorage.setItem(`offline-save-${memorialId}`, serialized);
                setSaveStatus('offline');
            } catch { /* silent */ }
            return;
        }

        isSavingRef.current = true;
        setSaveStatus('saving');
        setError(null);

        try {
            const { error: saveError } = await supabase
                .from('memorials')
                .update({
                    ...serializable,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', memorialId);

            if (saveError) throw saveError;

            lastSavedDataRef.current = serialized;
            setLastSavedAt(new Date());
            setSaveStatus('saved');

            localStorage.removeItem(`offline-save-${memorialId}`);

            setTimeout(() => {
                setSaveStatus(prev => prev === 'saved' ? 'idle' : prev);
            }, 2000);

        } catch (err: any) {
            console.error('Auto-save failed:', err);
            try {
                localStorage.setItem(`offline-save-${memorialId}`, serialized);
            } catch { /* silent */ }
            setError(err.message || 'Failed to save');
            setSaveStatus('error');
        } finally {
            isSavingRef.current = false;
        }
    }, [memorialId, enabled, serializeForSave]);

    const saveNow = useCallback(async () => {
        await performSave();
    }, [performSave]);

    // Debounced save on data change
    useEffect(() => {
        if (!memorialId || !enabled) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            performSave();
        }, debounceMs);

        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, [data, memorialId, enabled, debounceMs, performSave]);

    // Interval save every 30s
    useEffect(() => {
        if (!memorialId || !enabled) return;

        intervalTimerRef.current = setInterval(() => {
            performSave();
        }, intervalMs);

        return () => {
            if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
        };
    }, [memorialId, enabled, intervalMs, performSave]);

    // Sync offline cache on reconnect
    useEffect(() => {
        if (!memorialId || !enabled) return;

        const handleOnline = async () => {
            const cached = localStorage.getItem(`offline-save-${memorialId}`);
            if (cached) {
                setSaveStatus('reconnected');
                setTimeout(async () => {
                    await performSave();
                }, 1000);
            }
        };

        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [memorialId, enabled, performSave]);

    // Save on page unload (best effort)
    useEffect(() => {
        if (!memorialId || !enabled) return;

        const handleBeforeUnload = () => {
            const currentData = dataRef.current;
            const payload = JSON.stringify({
                memorialId,
                ...serializeForSave(currentData),
            });

            navigator.sendBeacon('/api/autosave', payload);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [memorialId, enabled, serializeForSave]);

    return { saveStatus, lastSavedAt, saveNow, error };
}
