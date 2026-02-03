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
    <div className="flex gap-2 justify-center mb-6">
      {steps.map((step) => {
        const canClickNextStep =
          step === currentStep + 1 && (currentStep === 2 || currentStep === 3);
        const disabled = step > maxStepReached && !canClickNextStep;
        return (
          <button
            key={step}
            disabled={disabled}
            onClick={() => onStepClick(step)}
            className={`w-8 h-8 rounded-full text-sm font-semibold
              ${
                step === currentStep
                  ? "bg-black text-white"
                  : disabled
                  ? "bg-gray-200 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
          >
            {step}
          </button>
        );
      })}
    </div>
  );
}
