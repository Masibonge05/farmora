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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-900 to-white-700">
      <div className="bg-white/90 rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl mb-2">🌿</span>
          <h2 className="text-2xl font-bold text-green-900 mb-1">Farmora</h2>
          <p className="text-green-700 text-sm font-semibold tracking-wide">Precision Ag Platform</p>
        </div>
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-lg font-semibold border ${mode==='signin' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border-green-700'}`}
            onClick={()=>setMode('signin')}
            disabled={mode==='signin'}
          >Sign In</button>
          <button
            className={`px-4 py-2 rounded-r-lg font-semibold border-l-0 border ${mode==='signup' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border-green-700'}`}
            onClick={()=>setMode('signup')}
            disabled={mode==='signup'}
          >Sign Up</button>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="px-4 py-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            className="px-4 py-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800 transition disabled:opacity-60"
            disabled={loading}
          >
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-green-200" />
          <span className="mx-2 text-green-500 text-xs font-semibold">or</span>
          <div className="flex-1 h-px bg-green-200" />
        </div>
        <button
          onClick={handleGoogle}
          className="w-full py-2 rounded bg-white border border-green-400 text-green-700 font-semibold hover:bg-green-50 flex items-center justify-center gap-2 disabled:opacity-60"
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block align-middle"><g><path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C34.7 32.1 30.1 35 24 35c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4C12.7 12.1 17.9 8 24 8c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48c5.5 0 10.5-1.6 14.4-4.4l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4C12.7 12.1 17.9 8 24 8c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48c5.5 0 10.5-1.6 14.4-4.4l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4C12.7 12.1 17.9 8 24 8c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48c5.5 0 10.5-1.6 14.4-4.4l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.2 16.1 18.7 13 24 13c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48c5.5 0 10.5-1.6 14.4-4.4l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4z"/><path fill="#FBBC05" d="M24 48c6.5 0 12-2.1 16.4-5.6l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4C12.7 12.1 17.9 8 24 8c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48z"/><path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3C34.7 32.1 30.1 35 24 35c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4C12.7 12.1 17.9 8 24 8c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 1.6 29.5 0 24 0 14.6 0 6.4 6.8 3.1 16.1c-0.7 2-1.1 4.1-1.1 6.3s0.4 4.3 1.1 6.3C6.4 41.2 14.6 48 24 48c5.5 0 10.5-1.6 14.4-4.4l-6.2-6.2C30 38.9 27.1 40 24 40c-6.1 0-11.3-4.1-13.1-9.6-0.4-1.1-0.6-2.3-0.6-3.4s0.2-2.3 0.6-3.4z"/></g></svg>
          Sign in with Google
        </button>
        {error && <div className="mt-4 text-red-600 text-center text-sm font-semibold">{error}</div>}
      </div>
    </div>
  )
}
