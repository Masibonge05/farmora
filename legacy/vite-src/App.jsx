import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  CloudSun,
  Eye,
  EyeOff,
  Languages,
  Pencil,
  Play,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import CropHealth from './pages/CropHealth';
import SoilWater from './pages/SoilWater';
import Market from './pages/Market';
import Sensors from './pages/Sensors';
import Alerts from './pages/Alerts';
import Weather from './pages/Weather';
import farmImage from './assets/Farm.png';

const pageMap = {
  overview: Overview,
  'crop-health': CropHealth,
  soil: SoilWater,
  market: Market,
  sensors: Sensors,
  alerts: Alerts,
  weather: Weather,
};

const onboardingSteps = [
  {
    id: 'farming-style',
    stageTitle: 'Farming Style',
    question: 'What type of farmer are you?',
    hint: 'Choose the one that sounds most like your setup.',
    options: [
      { label: 'Home grower', description: 'Growing mainly for household use.' },
      { label: 'Small business grower', description: 'Selling produce to local customers.' },
      { label: 'Community or school garden', description: 'Growing with a group or organization.' },
    ],
  },
  {
    id: 'space-identification',
    stageTitle: 'Space Identification',
    question: 'Where will you grow?',
    hint: 'Keep it relatable and simple. You do not need to think in hectares.',
    options: [
      { label: 'Backyard' },
      { label: 'Containers / pots' },
      { label: 'Small garden' },
    ],
  },
  {
    id: 'crop-intent',
    stageTitle: 'Crop Intent',
    question: 'What do you want to grow first?',
    hint: 'This helps tailor weather, pest, and soil guidance.',
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
    options: [
      { label: 'Daily' },
      { label: 'Every 2-3 days' },
      { label: 'Weekly or less' },
    ],
  },
  {
    id: 'alerts-tone',
    stageTitle: 'Alerts & Tips',
    question: 'How would you like to receive updates?',
    hint: 'Choose the format you are likely to follow consistently.',
    options: [
      { label: 'Short daily summary' },
      { label: 'Only urgent alerts' },
      { label: 'Balanced recommendations' },
    ],
  },
];

function LoginScreen({ onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="auth-shell">
      <div className="auth-blob auth-blob-top" />
      <div className="auth-blob auth-blob-right" />
      <div className="auth-blob auth-blob-left" />

      <div className="auth-header-actions">
        <button className="icon-pill" type="button" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>

        <button className="lang-pill" type="button" aria-label="Change language">
          <span>EN</span>
          <ChevronDown size={14} className="lang-pill-chevron" />
        </button>
      </div>

      <div className="auth-card animate-slide-in">
        <div className="avatar-ring">
          <img src={farmImage} alt="Farmer in a field" className="avatar-image" />
        </div>

        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-subtitle">
          Sign in to access smart, personalized farming insights made for you.
        </p>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSignIn();
          }}
        >
          <label className="field-label" htmlFor="email">Email address*</label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="example@gmail.com"
            required
          />

          <label className="field-label" htmlFor="password">Password*</label>
          <div className="password-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input auth-input-password"
              placeholder="@Sn123hsn#"
              required
            />
            <button
              className="input-icon-button"
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="auth-meta-row">
            <label className="remember-row" htmlFor="remember-me">
              <input id="remember-me" type="checkbox" />
              <span>Remember me</span>
            </label>

            <button type="button" className="text-link-button">Forgot Password?</button>
          </div>

          <button className="primary-auth-button" type="submit">Sign in</button>
        </form>

        <p className="auth-footnote">
          Don't have an account? <button type="button" className="text-link-button">Sign up</button>
        </p>
      </div>
    </section>
  );
}

function OnboardingScreen({ onComplete, onBackToLogin }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = onboardingSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === onboardingSteps.length - 1;
  const selectedOption = answers[step.id];

  const progressPercent = useMemo(
    () => ((stepIndex + 1) / onboardingSteps.length) * 100,
    [stepIndex],
  );

  const moveBack = () => {
    if (isFirstStep) {
      onBackToLogin();
      return;
    }

    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const moveForward = () => {
    if (!selectedOption) {
      return;
    }

    if (isLastStep) {
      onComplete();
      return;
    }

    setStepIndex((current) => Math.min(current + 1, onboardingSteps.length - 1));
  };

  return (
    <section className="onboarding-shell animate-fade-in">
      <div className="onboarding-top-row">
        <button type="button" className="icon-pill" onClick={moveBack} aria-label="Go to previous step">
          <ArrowLeft size={20} />
        </button>

        <button type="button" className="lang-pill" aria-label="Change language">
          <Languages size={15} />
          <span>EN</span>
          <ChevronDown size={14} className="lang-pill-chevron" />
        </button>
      </div>

      <div className="wizard-head-row">
        <div className="wizard-step">STEP {stepIndex + 1}</div>
        <div className="wizard-stage">{step.stageTitle}</div>
        <div className="wizard-count">{stepIndex + 1}/{onboardingSteps.length}</div>
      </div>

      <div className="wizard-progress">
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="wizard-copy">
        <h2>{step.question}</h2>
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
              className={`wizard-option ${selected ? 'selected' : ''}`}
              onClick={() => setAnswers((current) => ({ ...current, [step.id]: option.label }))}
            >
              <span className={`option-radio ${selected ? 'selected' : ''}`} />
              <div className="option-content">
                <div className="option-title-row">
                  {Icon ? <Icon size={18} strokeWidth={2.2} /> : null}
                  <span className="option-title">{option.label}</span>
                </div>
                {option.description ? <span className="option-description">{option.description}</span> : null}
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="primary-auth-button onboarding-next"
        onClick={moveForward}
        disabled={!selectedOption}
      >
        {isLastStep ? 'Finish Setup' : 'Next Step'}
      </button>
    </section>
  );
}

function Dashboard() {
  const [activePage, setActivePage] = useState('overview');
  const Page = pageMap[activePage] || Overview;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b150b' }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(45,106,45,0.06) 0%, transparent 70%)',
        }}
      />

      <Sidebar active={activePage} onNav={setActivePage} onAiOpen={() => {}} />

      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(11,21,11,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(74,158,74,0.1)',
            padding: '12px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 13, color: '#8a9e8a' }}>
            <span style={{ color: '#4a9e4a' }}>Thabo Farm</span> · Limpopo, South Africa
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4a9e4a' }}>
              <span className="status-dot status-ok"></span>
              Live · 7/7 sensors active
            </div>
            <div style={{ fontSize: 13, color: '#8a9e8a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CloudSun size={14} />
              <span>24°C · Limpopo</span>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2d6a2d, #7ec87e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
                color: '#0b150b',
                cursor: 'pointer',
              }}
            >
              T
            </div>
          </div>
        </div>

        <div className="animate-fade-in" key={activePage}>
          <Page />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('login');

  if (screen === 'login') {
    return <LoginScreen onSignIn={() => setScreen('onboarding')} />;
  }

  if (screen === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={() => setScreen('dashboard')}
        onBackToLogin={() => setScreen('login')}
      />
    );
  }

  return <Dashboard />;
}
