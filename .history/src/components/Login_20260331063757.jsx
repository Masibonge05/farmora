import React, { useContext, useState } from 'react'
import AuthContext from '../contexts/AuthContext'

export default function Login() {
  const { signIn, signUpWithEmail, signInWithEmail } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [googleHover, setGoogleHover] = useState(false)

  const handleGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      await signIn()
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password)
      }
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background:
          'radial-gradient(circle at 15% 15%, rgba(148,163,184,0.22), transparent 30%), radial-gradient(circle at 88% 18%, rgba(247,236,210,0.2), transparent 24%), linear-gradient(160deg, #f8f3ea 0%, #efe5d6 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.95), rgba(247,255,250,0.95))',
          border: '1px solid rgba(148,163,184,0.28)',
          borderRadius: 16,
          padding: '28px 24px',
          boxShadow: '0 22px 50px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 22 }}>
          <span style={{ fontSize: 22, marginBottom: 8, color: '#334155', fontWeight: 800, border: '1px solid #cbd5e1', borderRadius: 999, padding: '4px 10px' }}>F</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 800, color: '#2a241b', margin: 0 }}>Farmora</h2>
          <p style={{ color: '#a8946d', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', margin: '6px 0 0', textTransform: 'uppercase' }}>
            Precision Ag Platform
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginBottom: 18,
            background: 'rgba(148,163,184,0.08)',
            borderRadius: 12,
            padding: 6,
            border: '1px solid rgba(148,163,184,0.22)',
          }}
        >
          <button
            style={{
              padding: '9px 10px',
              borderRadius: 8,
              border: '1px solid transparent',
              fontWeight: 700,
              fontSize: 13,
              cursor: mode === 'signin' ? 'default' : 'pointer',
              color: mode === 'signin' ? '#2a241b' : '#b9ab92',
              background: mode === 'signin' ? 'linear-gradient(135deg, #e2e8f0, #f8fafc)' : 'transparent',
            }}
            onClick={() => setMode('signin')}
            disabled={mode === 'signin'}
          >
            Sign In
          </button>
          <button
            style={{
              padding: '9px 10px',
              borderRadius: 8,
              border: '1px solid transparent',
              fontWeight: 700,
              fontSize: 13,
              cursor: mode === 'signup' ? 'default' : 'pointer',
              color: mode === 'signup' ? '#2a241b' : '#b9ab92',
              background: mode === 'signup' ? 'linear-gradient(135deg, #e2e8f0, #f8fafc)' : 'transparent',
            }}
            onClick={() => setMode('signup')}
            disabled={mode === 'signup'}
          >
            Sign Up
          </button>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 10 }} onSubmit={handleSubmit}>
          <input
            style={{
              width: '100%',
              padding: '11px 12px',
              borderRadius: 10,
              border: '1px solid rgba(148,163,184,0.28)',
              background: '#ffffff',
              color: '#2a241b',
              fontSize: 14,
              outline: 'none',
            }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            style={{
              width: '100%',
              padding: '11px 12px',
              borderRadius: 10,
              border: '1px solid rgba(148,163,184,0.28)',
              background: '#ffffff',
              color: '#2a241b',
              fontSize: 14,
              outline: 'none',
            }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '11px 12px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #e2e8f0, #f8fafc)',
              color: '#2a241b',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
            disabled={loading}
          >
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(148,163,184,0.26)' }} />
          <span style={{ margin: '0 10px', color: '#77674f', fontSize: 11, fontWeight: 700 }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(148,163,184,0.26)' }} />
        </div>

        <button
          onClick={handleGoogle}
          onMouseEnter={() => setGoogleHover(true)}
          onMouseLeave={() => setGoogleHover(false)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 10,
            border: `1px solid ${googleHover ? 'rgba(100,116,139,0.42)' : 'rgba(148,163,184,0.28)'}`,
            background: googleHover
              ? 'linear-gradient(145deg, #ffffff, #f8fafc)'
              : 'linear-gradient(145deg, #ffffff, #fbfdff)',
            color: '#334155',
            fontWeight: 800,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
            boxShadow: googleHover
              ? '0 10px 24px rgba(15,23,42,0.12), inset 0 1px rgba(255,255,255,0.95)'
              : '0 4px 14px rgba(15,23,42,0.08), inset 0 1px rgba(255,255,255,0.9)',
            transform: googleHover ? 'translateY(-1px)' : 'translateY(0)',
            transition: 'all 0.2s ease',
          }}
          disabled={loading}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 999,
              background: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(15,23,42,0.12)',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 48 48" className="inline-block align-middle"><g><path fill="#EA4335" d="M24 9.5c3.9 0 7.4 1.3 10.1 3.9l7.5-7.5C36.8 2 30.8 0 24 0 14.6 0 6.4 5.4 2.4 13.3l8.8 6.8C13.2 13.6 18.1 9.5 24 9.5z" /><path fill="#4285F4" d="M46.5 24.5c0-1.7-.1-3.3-.5-4.9H24v9.3h12.6c-.5 3-2.2 5.5-4.7 7.2l7.3 5.6c4.3-4 7.3-10 7.3-17.2z" /><path fill="#FBBC05" d="M11.2 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-8.8-6.8C.9 16 .1 19.9.1 24s.8 8 2.3 11.5l8.8-6.8z" /><path fill="#34A853" d="M24 48c6.8 0 12.6-2.2 16.8-6l-7.3-5.6c-2 1.4-4.6 2.2-9.5 2.2-5.9 0-10.8-4.1-12.6-9.6l-8.8 6.8C6.4 42.6 14.6 48 24 48z" /></g></svg>
          </span>
          Sign in with Google
        </button>

        {error && <div style={{ marginTop: 12, color: '#b25a5a', textAlign: 'center', fontSize: 12, fontWeight: 700 }}>{error}</div>}
      </div>
    </div>
  )
}



