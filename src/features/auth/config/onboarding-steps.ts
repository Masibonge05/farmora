import type { LucideIcon } from 'lucide-react';
import { Camera, Pencil, Play } from 'lucide-react';

export interface OnboardingOption {
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export interface OnboardingStep {
  id: string;
  stageTitle: string;
  question: string;
  hint?: string;
  options: OnboardingOption[];
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'farming-style',
    stageTitle: 'Farming Style',
    question: 'What type of farmer are you?',
    hint: 'Choose the setup that feels most like your day-to-day reality.',
    options: [
      { label: 'Home grower', description: 'Growing mainly for household use.' },
      { label: 'Small business grower', description: 'Selling produce to local customers.' },
      { label: 'Community or school garden', description: 'Growing with a group or organisation.' },
    ],
  },
  {
    id: 'space-identification',
    stageTitle: 'Space Identification',
    question: 'Where will you grow?',
    hint: 'You do not need hectares to start. Pick the option that fits your space.',
    options: [{ label: 'Backyard' }, { label: 'Containers / pots' }, { label: 'Small garden' }],
  },
  {
    id: 'crop-intent',
    stageTitle: 'Crop Intent',
    question: 'What do you want to grow first?',
    hint: 'This helps personalise weather, pest, and soil guidance.',
    options: [
      { label: 'Leafy greens', description: 'Spinach, kale, lettuce, and similar crops.' },
      { label: 'Fruiting crops', description: 'Tomatoes, peppers, squash, and similar crops.' },
      { label: 'Mixed crops', description: 'A combination of greens, herbs, and fruiting plants.' },
    ],
  },
  {
    id: 'soil-understanding',
    stageTitle: 'Soil Understanding',
    question: "Let's understand your soil",
    options: [
      {
        label: 'Scan soil',
        description: 'Take a quick scan and let the app help interpret it.',
        icon: Camera,
      },
      {
        label: 'Describe it',
        description: 'Tell us what it looks and feels like in simple words.',
        icon: Pencil,
      },
      {
        label: 'Skip',
        description: 'You can come back to this later when you are ready.',
        icon: Play,
      },
    ],
  },
  {
    id: 'water-rhythm',
    stageTitle: 'Water Rhythm',
    question: 'How often can you water your plants?',
    hint: 'We use this to tune reminders and irrigation advice.',
    options: [{ label: 'Daily' }, { label: 'Every 2-3 days' }, { label: 'Weekly or less' }],
  },
  {
    id: 'alerts-tone',
    stageTitle: 'Alerts & Tips',
    question: 'How would you like to receive updates?',
    hint: 'Choose the format you are most likely to stick with.',
    options: [
      { label: 'Short daily summary' },
      { label: 'Only urgent alerts' },
      { label: 'Balanced recommendations' },
    ],
  },
];
