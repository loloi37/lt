'use client';

import { useState } from 'react';
import { UserCheck, Clock, Shield, ChevronDown, AlertTriangle } from 'lucide-react';
import type { SuccessorAccessLevel } from '@/types/memorial';

interface SuccessorData {
    email: string;
    name: string;
    accessLevel: SuccessorAccessLevel;
    deadManSwitchMonths: number;
}

interface SuccessionSetupProps {
    memorialId: string;
    existingSuccessor?: SuccessorData | null;
    isPreservationGate?: boolean;
    onSave?: (data: SuccessorData) => void;
}

const ACCESS_LEVELS: { value: SuccessorAccessLevel; label: string; description: string }[] = [
    { value: 'read_only', label: 'Read Only', description: 'Can view but not modify the memorial' },
    { value: 'editorial', label: 'Editorial', description: 'Can add content and correct errors' },
    { value: 'full_ownership', label: 'Full Ownership', description: 'Complete control including deletion rights' },
];

export default function SuccessionSetup({
    memorialId,
    existingSuccessor = null,
    isPreservationGate = false,
    onSave,
}: SuccessionSetupProps) {
    const [successor, setSuccessor] = useState<SuccessorData>(
        existingSuccessor || {
            email: '',
            name: '',
            accessLevel: 'editorial',
            deadManSwitchMonths: 12,
        }
    );
    const [saved, setSaved] = useState(!!existingSuccessor);

    const handleSave = () => {
        if (!successor.email || !successor.name) return;
        onSave?.(successor);
        setSaved(true);
    };

    return (
        <div className="bg-white border border-warm-border/40 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <UserCheck size={16} className="text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-warm-dark font-sans">Succession Planning</h3>
                        <p className="text-xs text-warm-muted font-sans">
                            {isPreservationGate ? 'Required before preservation' : 'Manage access continuity'}
                        </p>
                    </div>
                </div>
                {isPreservationGate && !saved && (
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-600 text-xs font-sans font-medium rounded-full">
                        Required
                    </span>
                )}
                {saved && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs font-sans font-medium rounded-full flex items-center gap-1">
                        <Shield size={10} /> Configured
                    </span>
                )}
            </div>

            {isPreservationGate && !saved && (
                <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-5">
                    <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700 font-sans">
                        You must designate a successor before your memorial can be permanently preserved.
                        This ensures continuous access to your memorial.
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {/* Successor name */}
                <div>
                    <label className="text-xs text-warm-muted font-sans mb-1 block">Successor name</label>
                    <input
                        type="text"
                        value={successor.name}
                        onChange={e => { setSuccessor(prev => ({ ...prev, name: e.target.value })); setSaved(false); }}
                        placeholder="e.g. Sarah Johnson"
                        className="w-full px-3 py-2 bg-white border border-warm-border/40 rounded-lg text-sm font-sans text-warm-dark placeholder:text-warm-outline focus:outline-none focus:border-emerald-500/40"
                    />
                </div>

                {/* Successor email */}
                <div>
                    <label className="text-xs text-warm-muted font-sans mb-1 block">Successor email</label>
                    <input
                        type="email"
                        value={successor.email}
                        onChange={e => { setSuccessor(prev => ({ ...prev, email: e.target.value })); setSaved(false); }}
                        placeholder="successor@example.com"
                        className="w-full px-3 py-2 bg-white border border-warm-border/40 rounded-lg text-sm font-sans text-warm-dark placeholder:text-warm-outline focus:outline-none focus:border-emerald-500/40"
                    />
                </div>

                {/* Access level */}
                <div>
                    <label className="text-xs text-warm-muted font-sans mb-2 block">Access level</label>
                    <div className="space-y-2">
                        {ACCESS_LEVELS.map(level => (
                            <button
                                key={level.value}
                                onClick={() => { setSuccessor(prev => ({ ...prev, accessLevel: level.value })); setSaved(false); }}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${
                                    successor.accessLevel === level.value
                                        ? 'border-emerald-500/40 bg-emerald-500/5'
                                        : 'border-warm-border/40 hover:border-warm-border/60'
                                }`}
                            >
                                <div>
                                    <p className="text-sm font-sans font-medium text-warm-dark">{level.label}</p>
                                    <p className="text-xs text-warm-muted font-sans">{level.description}</p>
                                </div>
                                {successor.accessLevel === level.value && (
                                    <div className="w-3 h-3 bg-emerald-600 rounded-full flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dead man's switch */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={14} className="text-warm-muted" />
                        <label className="text-xs text-warm-muted font-sans">Dead man&apos;s switch interval</label>
                    </div>
                    <div className="flex gap-2">
                        {[6, 12, 24].map(months => (
                            <button
                                key={months}
                                onClick={() => { setSuccessor(prev => ({ ...prev, deadManSwitchMonths: months })); setSaved(false); }}
                                className={`flex-1 py-2 text-sm font-sans rounded-lg border transition-colors ${
                                    successor.deadManSwitchMonths === months
                                        ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600'
                                        : 'border-warm-border/40 text-warm-muted hover:border-warm-border/60'
                                }`}
                            >
                                {months} months
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-warm-muted font-sans mt-2">
                        If you don&apos;t log in for {successor.deadManSwitchMonths} months, your successor will
                        be notified and granted access.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!successor.email || !successor.name}
                    className="w-full py-2.5 bg-emerald-600 text-white text-sm font-sans font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    {saved ? 'Update Succession Plan' : 'Save Succession Plan'}
                </button>
            </div>
        </div>
    );
}
