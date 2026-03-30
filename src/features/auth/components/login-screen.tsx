'use client';

import { startTransition, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, Eye, EyeOff } from 'lucide-react';

import farmImage from '@/assets/Farm.png';

export function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    startTransition(() => {
      router.push('/onboarding');
    });
  };

  return (
    <section className="auth-shell">
      <div className="auth-blob auth-blob-top" />
      <div className="auth-blob auth-blob-right" />
      <div className="auth-blob auth-blob-left" />

      <div className="auth-header-actions">
        <button className="icon-pill" type="button" aria-label="Go back">
          <ArrowLeft size={18} />
        </button>

        <button className="lang-pill" type="button" aria-label="Change language">
          <span>EN</span>
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="auth-card">
        <div className="auth-card__visual">
          <div className="avatar-ring">
            <Image src={farmImage} alt="Farmer in a field" className="avatar-image" priority />
          </div>
        </div>

        <div className="auth-copy">
          <span className="eyebrow">Precision agriculture workspace</span>
          <h1 className="auth-title">Welcome back to Farmora</h1>
          <p className="auth-subtitle">
            Sign in to review field health, irrigation actions, market movement, and sensor
            telemetry from a single operational view.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="example@gmail.com"
            required
          />

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <div className="password-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input auth-input--with-icon"
              placeholder="@Sn123hsn#"
              required
            />
            <button
              className="input-icon-button"
              type="button"
              onClick={() => setShowPassword((current) => !current)}
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

            <button type="button" className="text-link-button">
              Forgot password?
            </button>
          </div>

          <button className="primary-button" type="submit" disabled={isPending}>
            {isPending ? 'Opening workspace...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footnote">
          No account yet? <button type="button" className="text-link-button">Request access</button>
        </p>
      </div>
    </section>
  );
}
