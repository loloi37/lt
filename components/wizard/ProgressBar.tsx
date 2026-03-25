// components/wizard/ProgressBar.tsx
// Step 1.3.1: Remove numerical progress, use qualitative indicators
// No percentages, no colored bars. Simple path names with filled/empty circles.
'use client';
import { STEP_NAMES } from '@/types/memorial';

interface ProgressBarProps {
    currentStep: number;
    completedSteps: number[];
    onStepClick?: (step: number) => void;
}

export default function ProgressBar({ currentStep, completedSteps, onStepClick }: ProgressBarProps) {
    return (
        <div className="py-4">
            <div className="max-w-4xl mx-auto px-6">
                {/* Step 1.3.1: Current path name instead of "Step X of Y" */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-warm-dark/50">
                        {STEP_NAMES[currentStep - 1]}
                    </span>
                </div>

                {/* Step 1.3.1: Simple dots — filled for visited, empty for not */}
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
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        isCompleted
                                            ? 'bg-warm-dark/40'
                                            : isCurrent
                                                ? 'bg-warm-dark/25 ring-4 ring-warm-dark/5'
                                                : 'bg-warm-border/40 group-hover:bg-warm-border/60'
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
