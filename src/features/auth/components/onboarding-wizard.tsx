'use client';

import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, Languages } from 'lucide-react';

import { onboardingSteps } from '@/features/auth/config/onboarding-steps';
import { cn } from '@/shared/lib/cn';

export function OnboardingWizard() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);

  const step = onboardingSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === onboardingSteps.length - 1;
  const selectedOption = answers[step.id];
  const progressPercent = ((stepIndex + 1) / onboardingSteps.length) * 100;

  const moveBack = () => {
    if (isFirstStep) {
      router.push('/');
      return;
    }

    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const moveForward = () => {
    if (!selectedOption) {
      return;
    }

    if (isLastStep) {
      setIsPending(true);
      startTransition(() => {
        router.push('/dashboard/overview');
      });
      return;
    }

    setStepIndex((current) => Math.min(current + 1, onboardingSteps.length - 1));
  };

  return (
    <section className="onboarding-shell">
      <div className="onboarding-top-row">
        <button type="button" className="icon-pill" onClick={moveBack} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>

        <button type="button" className="lang-pill" aria-label="Change language">
          <Languages size={15} />
          <span>EN</span>
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="wizard-head-row">
        <span className="wizard-step">Step {stepIndex + 1}</span>
        <span className="wizard-stage">{step.stageTitle}</span>
        <span className="wizard-count">
          {stepIndex + 1}/{onboardingSteps.length}
        </span>
      </div>

      <div className="wizard-progress">
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="wizard-copy">
        <h1>{step.question}</h1>
        {step.hint ? <p>{step.hint}</p> : null}
      </div>

      <div className="wizard-options">
        {step.options.map((option) => {
          const selected = selectedOption === option.label;
          const Icon = option.icon;

          return (
            <button
              key={option.label}
              type="button"
              className={cn('wizard-option', selected && 'wizard-option--selected')}
              onClick={() =>
                setAnswers((current) => ({
                  ...current,
                  [step.id]: option.label,
                }))
              }
            >
              <span className={cn('option-radio', selected && 'option-radio--selected')} />
              <div className="option-content">
                <div className="option-title-row">
                  {Icon ? <Icon size={18} /> : null}
                  <span className="option-title">{option.label}</span>
                </div>
                {option.description ? (
                  <span className="option-description">{option.description}</span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="primary-button onboarding-next"
        onClick={moveForward}
        disabled={!selectedOption || isPending}
      >
        {isPending ? 'Preparing dashboard...' : isLastStep ? 'Finish setup' : 'Next step'}
      </button>
    </section>
  );
}
