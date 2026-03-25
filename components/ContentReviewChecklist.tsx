'use client';

import { useState } from 'react';
import { CheckSquare, Square, AlertTriangle, Shield, ArrowRight } from 'lucide-react';

interface ContentReviewChecklistProps {
    memorialId: string;
    onApprove: () => void;
    onEditFirst: () => void;
}

const CHECKLIST_ITEMS = [
    {
        id: 'rights',
        label: 'Content rights',
        description: 'I have the right to share all photos, videos, and text included in this memorial.',
    },
    {
        id: 'permissions',
        label: 'People mentioned',
        description: 'All living individuals mentioned or depicted have given their consent.',
    },
    {
        id: 'private_info',
        label: 'Private information',
        description: 'This memorial does not contain sensitive private information (Social Security numbers, financial details, passwords).',
    },
    {
        id: 'permanence',
        label: 'Permanence understanding',
        description: 'I understand that once preserved on Arweave, this memorial cannot be deleted or fully removed.',
    },
    {
        id: 'accuracy',
        label: 'Accuracy',
        description: 'I have reviewed all dates, names, and facts for accuracy to the best of my knowledge.',
    },
];

export default function ContentReviewChecklist({ memorialId, onApprove, onEditFirst }: ContentReviewChecklistProps) {
    const [checked, setChecked] = useState<Set<string>>(new Set());

    const toggle = (id: string) => {
        setChecked(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const allChecked = checked.size === CHECKLIST_ITEMS.length;

    return (
        <div className="bg-surface-mid rounded-xl border border-warm-border p-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Shield size={16} className="text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-warm-dark font-sans">Content Review</h3>
            </div>
            <p className="text-xs text-warm-muted font-sans mb-5">
                Please confirm each item before preserving this memorial permanently.
            </p>

            <div className="space-y-3 mb-6">
                {CHECKLIST_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                            checked.has(item.id)
                                ? 'border-green-500/30 bg-green-500/5'
                                : 'border-warm-border hover:border-warm-muted/30'
                        }`}
                    >
                        {checked.has(item.id) ? (
                            <CheckSquare size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                            <Square size={18} className="text-warm-muted flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                            <p className="text-sm font-sans font-medium text-warm-dark">{item.label}</p>
                            <p className="text-xs text-warm-muted font-sans mt-0.5">{item.description}</p>
                        </div>
                    </button>
                ))}
            </div>

            {!allChecked && (
                <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg mb-4">
                    <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-300 font-sans">
                        All items must be confirmed before preservation can proceed.
                    </p>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={onApprove}
                    disabled={!allChecked}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-sans font-medium text-white bg-green-600 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Shield size={14} />
                    Approve for Preservation
                    <ArrowRight size={14} />
                </button>
                <button
                    onClick={onEditFirst}
                    className="px-4 py-2.5 text-sm font-sans font-medium text-warm-muted hover:text-warm-dark transition-colors"
                >
                    Edit First
                </button>
            </div>
        </div>
    );
}
