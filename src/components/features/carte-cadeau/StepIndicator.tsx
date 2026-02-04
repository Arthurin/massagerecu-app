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
    <div className="tw:flex tw:gap-3 tw:justify-center tw:mb-6">
      {steps.map((step) => {
        const canClickNextStep =
          step === currentStep + 1 && (currentStep === 2 || currentStep === 3);
        const disabled = step > maxStepReached && !canClickNextStep;
        const isCurrent = step === currentStep;
        const isReached = step <= maxStepReached;
        const baseClass =
          "tw:rounded-full tw:p-0 tw:w-3 tw:h-3 dot-app border-0";
        const currentClass = "tw:ring-4 tw:ring-blue-200";
        const reachedClass = "tw:bg-blue-500";
        const upcomingClass = "tw:bg-blue-100";
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
            } ${
              disabled
                ? "tw:opacity-60 tw:cursor-not-allowed"
                : "hover:tw:bg-violet-600"
            }`}
          >
            <span className="tw:sr-only">{step}</span>
          </button>
        );
      })}
    </div>
  );
}
