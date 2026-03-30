// @ts-nocheck
'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  CloudSun,
  Droplets,
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
import farmImage from '../assets/Farm.png';
import { DashboardDataProvider } from './data/dashboard-provider';
import { AssistantFab } from './components/AssistantFab';
import { LocationStep } from './components/LocationStep';
import { supabase } from '@/shared/lib/supabase';

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
    id: 'farm-location',
    stageTitle: 'Farm Location',
    question: 'Where is your farm?',
    hint: 'We’ll tune weather and language to your area.',
    options: [
      { label: 'Limpopo / Gauteng / North West' },
      { label: 'KZN / Eastern Cape' },
      { label: 'Western / Northern / Free State' },
    ],
  },
  {
    id: 'farm-size',
    stageTitle: 'Farm Size',
    question: 'How big is your land?',
    hint: 'Small-scale focused. We’ll right-size insights for you.',
    options: [
      { label: '0 – 5 ha', description: 'Backyard / micro plot' },
      { label: '5 – 10 ha', description: 'Small commercial' },
      { label: '10 – 20 ha', description: 'Growing operation' },
    ],
  },
  {
    id: 'focus-crops',
    stageTitle: 'Focus Crops',
    question: 'What are you growing first?',
    hint: 'Drives vision models, disease watchlists, and market signals.',
    options: [
      { label: 'Leafy greens', description: 'Spinach, kale, lettuce' },
      { label: 'Tomatoes & peppers', description: 'High-value fruiting crops' },
      { label: 'Maize / sorghum', description: 'Staple grains' },
      { label: 'Mixed veggies', description: 'A bit of everything' },
    ],
  },
  {
    id: 'devices',
    stageTitle: 'Devices You Have',
    question: 'What data can we read today?',
    hint: 'Start simple. You can add hardware later.',
    options: [
      { label: 'Soil moisture probe', description: 'Live irrigation guidance', icon: Droplets },
      { label: 'Camera / phone scout', description: 'AI crop scans & disease alerts', icon: Camera },
      { label: 'No devices yet', description: 'Software-only to start', icon: Play },
    ],
  },
  {
    id: 'goals',
    stageTitle: 'Your Goal',
    question: 'What matters most right now?',
    hint: 'We’ll emphasise recommendations for this outcome.',
    options: [
      { label: 'Increase yield', description: 'Push production up' },
      { label: 'Reduce risk', description: 'Fewer surprises from weather/pests' },
      { label: 'Save water', description: 'Precise irrigation guidance' },
      { label: 'Market timing', description: 'Harvest + price windows' },
    ],
  },
  {
    id: 'alerts-tone',
    stageTitle: 'Alerts & Language',
    question: 'How should we talk to you?',
    hint: 'We keep it simple and on time.',
    options: [
      { label: 'WhatsApp + push, urgent only' },
      { label: 'Daily summary + urgent alerts' },
      { label: 'Full guidance in English' },
      { label: 'Full guidance in isiZulu / Sesotho', description: 'We’ll localise copy' },
    ],
  },
];

function LoginScreen({ onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          <img src={farmImage?.src || farmImage} alt="Farmer in a field" className="avatar-image" />
        </div>

        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-subtitle">
          Sign in to access smart, personalized farming insights made for you.
        </p>

        <form
          className="auth-form"
          onSubmit={async (event) => {
            event.preventDefault();
            setError('');
            setLoading(true);

            const email = (event.target as any).email.value;
            const password = (event.target as any).password.value;

            if (supabase) {
              const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              if (authError) {
                setError(authError.message);
                setLoading(false);
                return;
              }
            }

            setLoading(false);
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

          {error ? (
            <div style={{ color: '#c85820', fontSize: 12, marginTop: -4, marginBottom: 6 }}>{error}</div>
          ) : null}

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

          <button className="primary-auth-button" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
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
  const [sessionData, setSessionData] = useState({});

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
      <div className="onboarding-container">
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

      {step.id === 'farm-location' ? (
        <div className="wizard-options">
          <LocationStep
            onSelect={(payload) => {
              setAnswers((current) => ({ ...current, [step.id]: payload.label }));
              setSessionData((current) => ({ ...current, location: payload }));
            }}
          />
          <div style={{ fontSize: 12, color: '#8a9e8a' }}>
            We&apos;ll use this to personalise weather, alerts, and language.
          </div>
        </div>
      ) : (
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
                  {option.description ? (
                    <span className="option-description">{option.description}</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="primary-auth-button onboarding-next"
        onClick={moveForward}
        disabled={!selectedOption}
      >
        {isLastStep ? 'Finish Setup' : 'Next Step'}
      </button>
      </div>
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

  const renderScreen = () => {
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
  };

  return (
    <DashboardDataProvider>
      {renderScreen()}
      <AssistantFab />
    </DashboardDataProvider>
  );
}
