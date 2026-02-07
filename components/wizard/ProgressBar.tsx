// components/wizard/ProgressBar.tsx
'use client';
import { TOTAL_STEPS, STEP_NAMES } from '@/types/memorial';

interface ProgressBarProps {
    currentStep: number;
    completedSteps: number[];
    onStepClick?: (step: number) => void;
}

export default function ProgressBar({ currentStep, completedSteps, onStepClick }: ProgressBarProps) {
    const completionPercentage = Math.round((completedSteps.length / (TOTAL_STEPS - 1)) * 100);

    return (
        <div className="py-4">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-charcoal">
                            Step {currentStep} of {TOTAL_STEPS}
                        </span>
                        <span className="text-xs text-charcoal/40">•</span>
                        <span className="text-sm text-charcoal/60">
                            {STEP_NAMES[currentStep - 1]}
                        </span>
                    </div>
                    <div className="text-xs text-charcoal/40">
                        {completionPercentage}% complete
                    </div>
                </div>

                <div className="relative h-2 bg-sand/30 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-sage to-terracotta rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>

                <div className="flex items-center justify-between mt-4">
                    {Array.from({ length: TOTAL_STEPS }).map((_, idx) => {
                        const stepNumber = idx + 1;
                        const isCompleted = completedSteps.includes(stepNumber);
                        const isCurrent = stepNumber === currentStep;

                        return (
                            <button
                                key={stepNumber}
                                onClick={() => onStepClick?.(stepNumber)}
                                className="flex flex-col items-center gap-1 group cursor-pointer hover:scale-110 transition-transform"
                                title={`${isCompleted ? 'Completed: ' : ''}${STEP_NAMES[idx]}`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${isCompleted
                                        ? 'bg-sage text-ivory group-hover:bg-sage/80'
                                        : isCurrent
                                            ? 'bg-terracotta text-ivory ring-4 ring-terracotta/20 group-hover:ring-terracotta/30'
                                            : 'bg-sand/40 text-charcoal/40 group-hover:bg-sand/60'
                                        }`}
                                >
                                    {isCompleted ? '✓' : stepNumber}
                                </div>
                                <div
                                    className={`hidden md:block text-[10px] text-center max-w-[60px] leading-tight ${isCurrent ? 'text-charcoal font-medium' : 'text-charcoal/40'
                                        }`}
                                >
                                    {STEP_NAMES[idx].split(' ')[0]}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}