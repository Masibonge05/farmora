import React, { useContext, useState } from 'react'
import AuthContext from '../contexts/AuthContext'

export default function Login() {
  const { signIn, signUpWithEmail, signInWithEmail } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin') // 'signin' or 'signup'
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    setError(null)
    setLoading(true)
    try { await signIn() } catch (e) { setError(e.message) }
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
          'radial-gradient(circle at 15% 15%, rgba(74,158,74,0.14), transparent 30%), radial-gradient(circle at 88% 18%, rgba(58,140,200,0.12), transparent 24%), linear-gradient(160deg, #081208 0%, #0c170c 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          background: 'linear-gradient(160deg, rgba(16,30,16,0.9), rgba(9,18,9,0.94))',
          border: '1px solid rgba(126,200,126,0.22)',
          borderRadius: 16,
          padding: '28px 24px',
          boxShadow: '0 22px 50px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 22 }}>
          <span style={{ fontSize: 34, marginBottom: 8 }}>🌿</span>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800, color: '#eef7ee', margin: 0 }}>Farmora</h2>
          <p style={{ color: '#96ad96', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', margin: '6px 0 0', textTransform: 'uppercase' }}>
            Precision Ag Platform
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginBottom: 18,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 12,
            padding: 6,
            border: '1px solid rgba(126,200,126,0.15)',
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
              color: mode === 'signin' ? '#f1f8f1' : '#9fb39f',
              background: mode === 'signin' ? 'linear-gradient(135deg, #2d6a2d, #3f8b3f)' : 'transparent',
            }}
            onClick={()=>setMode('signin')}
            disabled={mode==='signin'}
          >Sign In</button>
          <button
            style={{
              padding: '9px 10px',
              borderRadius: 8,
              border: '1px solid transparent',
              fontWeight: 700,
              fontSize: 13,
              cursor: mode === 'signup' ? 'default' : 'pointer',
              color: mode === 'signup' ? '#f1f8f1' : '#9fb39f',
              background: mode === 'signup' ? 'linear-gradient(135deg, #2d6a2d, #3f8b3f)' : 'transparent',
            }}
            onClick={()=>setMode('signup')}
            disabled={mode==='signup'}
          >Sign Up</button>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 10 }} onSubmit={handleSubmit}>
          <input
            style={{
              width: '100%',
              padding: '11px 12px',
              borderRadius: 10,
              border: '1px solid rgba(126,200,126,0.25)',
              background: 'rgba(255,255,255,0.03)',
              color: '#ecf7ec',
              fontSize: 14,
              outline: 'none',
            }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            style={{
              width: '100%',
              padding: '11px 12px',
              borderRadius: 10,
              border: '1px solid rgba(126,200,126,0.25)',
              background: 'rgba(255,255,255,0.03)',
              color: '#ecf7ec',
              fontSize: 14,
              outline: 'none',
            }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '11px 12px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #2d6a2d, #4a9e4a)',
              color: '#eef7ee',
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
          <div style={{ flex: 1, height: 1, background: 'rgba(126,200,126,0.16)' }} />
          <span style={{ margin: '0 10px', color: '#87a687', fontSize: 11, fontWeight: 700 }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(126,200,126,0.16)' }} />
        </div>

        <button
          onClick={handleGoogle}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid rgba(126,200,126,0.26)',
            background: 'rgba(255,255,255,0.04)',
            color: '#d2e8d2',
            fontWeight: 700,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block align-middle"><g><path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C34.7 32.1 30.1 35 24 35c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4C12.7 12.1 17.9 8 24 8c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48c5.5 0 10.5-1.6 14.4-4.4l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4C12.7 12.1 17.9 8 24 8c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48c5.5 0 10.5-1.6 14.4-4.4l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4C12.7 12.1 17.9 8 24 8c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48c5.5 0 10.5-1.6 14.4-4.4l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.2 16.1 18.7 13 24 13c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48c5.5 0 10.5-1.6 14.4-4.4l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4z"/><path fill="#FBBC05" d="M24 48c6.5 0 12-2.1 16.4-5.6l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4C12.7 12.1 17.9 8 24 8c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48z"/><path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3C34.7 32.1 30.1 35 24 35c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4C12.7 12.1 17.9 8 24 8c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48c5.5 0 10.5-1.6 14.4-4.4l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4z"/></g></svg>
          Sign in with Google
        </button>
        {error && <div style={{ marginTop: 12, color: '#f08060', textAlign: 'center', fontSize: 12, fontWeight: 700 }}>{error}</div>}
      </div>
    </div>
  )
}
