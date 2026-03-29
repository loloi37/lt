// components/wizard/ProgressBar.tsx
// Organic presence visualization — no percentages, no step counts
// Shows the current emotional state and path depth through evolving visual warmth
'use client';

import { STEP_NAMES } from '@/types/memorial';
import { EmotionalState } from '@/lib/emotionalState';

interface ProgressBarProps {
    currentStep: number;
    completedSteps: number[];
    onStepClick?: (step: number) => void;
    emotionalState?: EmotionalState;
}

const STATE_STYLES: Record<EmotionalState, { glow: string; dot: string; label: string }> = {
    void: {
        glow: 'bg-warm-border/10',
        dot: 'bg-warm-border/20',
        label: '',
    },
    fragile: {
        glow: 'bg-warm-border/20',
        dot: 'bg-warm-dark/20',
        label: 'Fragile',
    },
    emerging: {
        glow: 'bg-olive/10',
        dot: 'bg-olive/30',
        label: 'Emerging',
    },
    substantial: {
        glow: 'bg-olive/15',
        dot: 'bg-warm-dark/40',
        label: 'Substantial',
    },
    eternal: {
        glow: 'bg-olive/20',
        dot: 'bg-warm-dark/60',
        label: 'Eternal',
    },
};

export default function ProgressBar({ currentStep, completedSteps, onStepClick, emotionalState = 'void' }: ProgressBarProps) {
    const stateStyle = STATE_STYLES[emotionalState];

    return (
        <div className="py-4">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-warm-dark/50">
                        {STEP_NAMES[currentStep - 1]}
                    </span>
                    {stateStyle.label && (
                        <span className="text-[10px] text-warm-dark/25 uppercase tracking-[0.2em] transition-all duration-1000">
                            {stateStyle.label}
                        </span>
                    )}
                </div>

                {/* Organic presence: dots that grow warmer and more present as depth increases */}
                <div className="flex items-center gap-3">
                    {STEP_NAMES.map((name, idx) => {
                        const stepNumber = idx + 1;
                        const isCompleted = completedSteps.includes(stepNumber);
                        const isCurrent = stepNumber === currentStep;

                        return (
                            <button
                                key={stepNumber}
                                onClick={() => onStepClick?.(stepNumber)}
                                className="group cursor-pointer"
                                title={name}
                            >
                                <div
                                    className={`w-2 h-2 rounded-full transition-all duration-700 ${
                                        isCurrent
                                            ? `${stateStyle.dot} ring-4 ring-warm-dark/5`
                                            : isCompleted
                                                ? stateStyle.dot
                                                : 'bg-warm-border/20 group-hover:bg-warm-border/40'
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
