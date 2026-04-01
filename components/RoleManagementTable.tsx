'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { WitnessRole } from '@/types/memorial';
import Toast from '@/components/Toast';

// ─── Types ──────────────────────────────────────────────────────────────────

interface MemberRecord {
  userId: string | null;
  email: string;
  displayName: string | null;
  role: WitnessRole;
  status: 'active' | 'pending';
  joinedAt: string | null;
}

interface RoleManagementTableProps {
  memorialId: string;
  isOwner: boolean;
  planType: 'personal' | 'family' | 'draft' | 'concierge';
  inviteStepHref?: string;
}

// ─── Role Config ────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  owner: { label: 'Owner', colorClass: 'text-plum', bgClass: 'bg-plum/10 border-plum/20' },
  co_guardian: { label: 'Co-Guardian', colorClass: 'text-warm-brown', bgClass: 'bg-warm-brown/10 border-warm-brown/20' },
  witness: { label: 'Witness', colorClass: 'text-olive', bgClass: 'bg-olive/10 border-olive/20' },
  reader: { label: 'Reader', colorClass: 'text-warm-muted', bgClass: 'bg-surface-mid border-warm-border/30' },
};

const ASSIGNABLE_ROLES: { value: WitnessRole; label: string }[] = [
  { value: 'co_guardian', label: 'Co-Guardian' },
  { value: 'witness', label: 'Witness' },
  { value: 'reader', label: 'Reader' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function RoleManagementTable({
  memorialId,
  isOwner,
  planType,
  inviteStepHref,
}: RoleManagementTableProps) {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch(`/api/archive/${memorialId}/members`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMembers(data.members || []);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  }, [memorialId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRoleChange = async (targetUserId: string, newRole: WitnessRole, email: string) => {
    // Optimistic update
    setMembers(prev =>
      prev.map(m =>
        m.userId === targetUserId ? { ...m, role: newRole } : m
      )
    );

    try {
      const res = await fetch(`/api/archive/${memorialId}/update-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, newRole }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update');
      }

      setToastMessage(`Permissions updated for ${email}`);
      setShowToast(true);
    } catch (err) {
      // Revert on failure
      fetchMembers();
      console.error('Role update failed:', err);
    }
  };

  // Filter roles available based on plan type
  const availableRoles = ASSIGNABLE_ROLES.filter(r => {
    if (r.value === 'co_guardian' && planType !== 'family') return false;
    return true;
  });

  if (loading) {
    return (
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <Users size={18} className="text-warm-muted" />
          <h3 className="font-serif italic text-lg text-warm-dark">
            {planType === 'family' ? 'Members' : 'Witnesses'}
          </h3>
        </div>
        <div className="flex justify-center py-8">
          <Loader2 size={20} className="text-warm-muted/40 animate-spin" />
        </div>
      </div>
    );
  }

  const activeMembers = members.filter(m => m.status === 'active');
  const pendingMembers = members.filter(m => m.status === 'pending');

  return (
    <>
      <Toast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
      />

      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-warm-muted" />
            <h3 className="font-serif italic text-lg text-warm-dark">
              {planType === 'family' ? 'Members' : 'Witnesses'}
            </h3>
          </div>
          {inviteStepHref && (
            <Link
              href={inviteStepHref}
              className="text-xs font-serif italic text-olive hover:text-olive/80 transition-colors underline underline-offset-2"
            >
              Invite new
            </Link>
          )}
        </div>

        {activeMembers.length <= 1 && pendingMembers.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-warm-muted font-serif italic mb-3">
              No witnesses yet.
            </p>
            {inviteStepHref && (
              <Link
                href={inviteStepHref}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-serif italic text-olive border border-olive/20 rounded-lg hover:bg-olive/5 transition-colors"
              >
                <Users size={14} />
                Invite witnesses
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {/* Active Members */}
            {activeMembers.map((member) => (
              <MemberRow
                key={member.userId || member.email}
                member={member}
                isOwner={isOwner}
                availableRoles={availableRoles}
                onRoleChange={handleRoleChange}
              />
            ))}

            {/* Pending Invitations */}
            {pendingMembers.length > 0 && (
              <>
                {activeMembers.length > 0 && (
                  <div className="border-t border-warm-border/20 my-3" />
                )}
                {pendingMembers.map((member) => (
                  <PendingRow key={member.email} member={member} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Member Row ─────────────────────────────────────────────────────────────

function MemberRow({
  member,
  isOwner,
  availableRoles,
  onRoleChange,
}: {
  member: MemberRecord;
  isOwner: boolean;
  availableRoles: { value: WitnessRole; label: string }[];
  onRoleChange: (userId: string, role: WitnessRole, email: string) => void;
}) {
  const config = ROLE_CONFIG[member.role] || ROLE_CONFIG.witness;
  const isLocked = member.role === 'owner';

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-surface-mid/50 transition-colors">
      {/* Identity */}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-warm-dark font-serif truncate">
          {member.email}
        </p>
        {member.joinedAt && (
          <p className="text-[10px] text-warm-outline font-serif italic mt-0.5">
            Joined {new Date(member.joinedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Role Badge / Selector */}
      <div className="flex-shrink-0 ml-4">
        {isLocked ? (
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-serif italic border ${config.bgClass} ${config.colorClass}`}>
            {config.label}
          </span>
        ) : isOwner && member.userId ? (
          <RoleDropdown
            currentRole={member.role}
            availableRoles={availableRoles}
            onChange={(newRole) => onRoleChange(member.userId!, newRole, member.email)}
          />
        ) : (
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-serif italic border ${config.bgClass} ${config.colorClass}`}>
            {config.label}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Pending Row ────────────────────────────────────────────────────────────

function PendingRow({ member }: { member: MemberRecord }) {
  const config = ROLE_CONFIG[member.role] || ROLE_CONFIG.witness;

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl opacity-70">
      {/* Identity — italic for pending */}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-warm-muted font-serif italic truncate">
          {member.email}
        </p>
      </div>

      {/* Pending badge + role */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-serif italic bg-warm-border/20 text-warm-outline border border-warm-border/30">
          Pending
        </span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-serif italic border ${config.bgClass} ${config.colorClass}`}>
          {config.label}
        </span>
      </div>
    </div>
  );
}

// ─── Role Dropdown ──────────────────────────────────────────────────────────

function RoleDropdown({
  currentRole,
  availableRoles,
  onChange,
}: {
  currentRole: WitnessRole;
  availableRoles: { value: WitnessRole; label: string }[];
  onChange: (role: WitnessRole) => void;
}) {
  const [open, setOpen] = useState(false);
  const config = ROLE_CONFIG[currentRole] || ROLE_CONFIG.witness;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif italic border transition-colors hover:bg-surface-mid ${config.bgClass} ${config.colorClass}`}
      >
        {config.label}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-warm-border/30 rounded-xl shadow-lg py-1 min-w-[140px]">
            {availableRoles.map((role) => {
              const roleConfig = ROLE_CONFIG[role.value];
              const isActive = role.value === currentRole;

              return (
                <button
                  key={role.value}
                  onClick={() => {
                    if (!isActive) onChange(role.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-serif italic transition-colors ${
                    isActive
                      ? `${roleConfig.colorClass} bg-surface-mid/50 font-medium`
                      : 'text-warm-muted hover:text-warm-dark hover:bg-surface-mid/30'
                  }`}
                >
                  {role.label}
                  {isActive && <span className="ml-2 text-warm-outline">&bull;</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
