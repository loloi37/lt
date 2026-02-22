'use client';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface TutorialStep {
    target: string; // Kept for compatibility but unused
    title: string;
    description: string;
    position: 'top' | 'bottom' | 'left' | 'right'; // Kept for compatibility but unused
}

interface TutorialPopupProps {
    steps: TutorialStep[];
    onComplete: () => void;
    onSkip: () => void;
}

export default function TutorialPopup({ steps, onComplete, onSkip }: TutorialPopupProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const goToNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const goToPrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-100 bg-black/20">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                {/* Popup card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-full animate-fadeIn border border-sand/20">


                    {/* Content */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-mist/10 rounded-full flex items-center justify-center">
                                <span className="text-mist font-semibold text-sm">
                                    {currentStep + 1}
                                </span>
                            </div>
                            <h3 className="font-serif text-xl text-charcoal">{step.title}</h3>
                        </div>
                        <p className="text-charcoal/70 leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mb-4">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all ${idx === currentStep
                                    ? 'w-8 bg-mist'
                                    : idx < currentStep
                                        ? 'w-1.5 bg-mist/50'
                                        : 'w-1.5 bg-sand/40'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={goToPrevious}
                                className="flex-1 py-2.5 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all flex items-center justify-center gap-2 font-medium text-charcoal"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                        )}
                        <button
                            onClick={goToNext}
                            className="flex-1 py-2.5 bg-mist hover:bg-mist/90 text-ivory rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
                        >
                            {currentStep < steps.length - 1 ? 'Next' : 'Got it!'}
                            {currentStep < steps.length - 1 && <ArrowRight size={18} />}
                        </button>
                    </div>

                    {/* Skip button */}
                    <button
                        onClick={onSkip}
                        className="w-full mt-3 text-sm text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                        Skip tutorial
                    </button>
                </div>
            </div>
            );
        </div>
    );
}
