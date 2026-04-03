// app/dashboard/[userId]/_components/ManageWitnessesModal.tsx
'use client';

import { X, Users, ShieldCheck } from 'lucide-react';
import InviteComposer from '@/components/role/InviteComposer';
import RoleManagementTable from '@/components/role/RoleManagementTable';

interface ManageWitnessesModalProps {
    isOpen: boolean;
    onClose: () => void;
    memorialId: string;
    memorialName: string;
    planType: 'personal' | 'family';
}

export default function ManageWitnessesModal({
    isOpen,
    onClose,
    memorialId,
    memorialName,
    planType
}: ManageWitnessesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 glass-modal-overlay animate-fadeIn">
            <div className="glass-modal w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-warm-border/30">

                {/* Header */}
                <div className="p-6 border-b border-warm-border/20 flex items-center justify-between bg-surface-mid/50 flex-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center text-olive">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl text-warm-dark leading-tight">Manage Witnesses</h2>
                            <p className="text-xs text-warm-dark/40 font-sans italic">For {memorialName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-warm-border/20 rounded-full transition-colors text-warm-dark/40 hover:text-warm-dark"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">

                    {/* Section 1: Invite New */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-warm-dark/60">
                            <ShieldCheck size={16} />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Invite Someone New</h3>
                        </div>
                        <div className="bg-surface-low/50 p-6 rounded-2xl border border-warm-border/20">
                            <InviteComposer memorialId={memorialId} planType={planType} />
                        </div>
                    </section>

                    {/* Section 2: Current Members */}
                    <section className="space-y-4 pb-4">
                        <div className="flex items-center gap-2 text-warm-dark/60">
                            <Users size={16} />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Active & Pending</h3>
                        </div>
                        <RoleManagementTable
                            memorialId={memorialId}
                            isOwner={true}
                            planType={planType}
                        />
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 bg-surface-low border-t border-warm-border/10 text-center flex-none">
                    <p className="text-[10px] text-warm-dark/30 uppercase tracking-tighter">
                        Witnesses can only view or contribute. Co-Guardians share editing rights.
                    </p>
                </div>
            </div>
        </div>
    );
}