"use client";

interface StepIndicatorProps {
  currentStep: number;
  maxStepReached: number;
  onStepClick: (step: number) => void;
}

export default function StepIndicator({
  currentStep,
  maxStepReached,
  onStepClick,
}: StepIndicatorProps) {
  const steps = [1, 2, 3, 4];

  return (
    <div className="flex gap-3 justify-center mb-6">
      {steps.map((step) => {
        const canClickNextStep =
          step === currentStep + 1 && (currentStep === 2 || currentStep === 3);
        const disabled = step > maxStepReached && !canClickNextStep;
        const isCurrent = step === currentStep;
        const isReached = step <= maxStepReached;
        const baseClass =
          "rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300";
        const currentClass = "w-4 h-4 bg-blue-500 ring-4 ring-blue-100";
        const reachedClass = "w-3.5 h-3.5 bg-blue-500";
        const upcomingClass = "w-3.5 h-3.5 bg-blue-100";
        return (
          <button
            key={step}
            disabled={disabled}
            onClick={() => onStepClick(step)}
            aria-label={`Étape ${step}`}
            className={`${baseClass} ${
              isCurrent
                ? currentClass
                : isReached
                ? reachedClass
                : upcomingClass
            } ${disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-400"}`}
          >
            <span className="sr-only">{step}</span>
          </button>
        );
      })}
    </div>
  );
}
