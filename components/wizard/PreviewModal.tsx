// components/wizard/PreviewModal.tsx
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
        <div className="fixed inset-0 bg-charcoal/90 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="min-h-screen py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 px-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-ivory mb-1">Memorial Preview</h2>
                            <p className="text-ivory/60 text-sm">This is how your memorial will look to visitors</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-ivory/10 hover:bg-ivory/20 rounded-full transition-all"
                        >
                            <X size={24} className="text-ivory" />
                        </button>
                    </div>

                    {/* Preview Container */}
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
                            className="px-8 py-3 bg-ivory hover:bg-ivory/90 text-charcoal rounded-xl font-medium transition-all shadow-lg"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
