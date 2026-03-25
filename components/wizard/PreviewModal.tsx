// components/wizard/PreviewModal.tsx
// Step 1.2.1: Full-fidelity preview — identical to published version
// Step 1.2.2: Elegant watermark, not intrusive
'use client';

import { X } from 'lucide-react';
import { MemorialData } from '@/types/memorial';
import MemorialRenderer from '@/components/MemorialRenderer';

interface PreviewModalProps {
    data: MemorialData;
    onClose: () => void;
}

export default function PreviewModal({ data, onClose }: PreviewModalProps) {
    return (
        <div className="fixed inset-0 bg-warm-dark/90 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="min-h-screen py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 px-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-surface-low mb-1">Archive Preview</h2>
                            <p className="text-surface-low/50 text-sm">This is how your archive will appear to visitors. The final version will be identical.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-surface-low/10 hover:bg-surface-low/20 rounded-full transition-all"
                        >
                            <X size={24} className="text-surface-low" />
                        </button>
                    </div>

                    {/* Step 1.2.1: Preview Container — uses SAME renderer as published page */}
                    <div className="rounded-2xl shadow-2xl overflow-hidden">
                        <MemorialRenderer
                            data={data}
                            isPreview={true}
                            compact={false}
                        />
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-surface-low hover:bg-surface-low/90 text-warm-dark rounded-xl font-medium transition-all shadow-lg"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
