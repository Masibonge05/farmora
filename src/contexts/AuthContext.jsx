import React, { createContext, useEffect, useState } from 'react'
import { auth, provider } from '../firebase'
import {
  signInWithPopup as firebaseSignInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { setUser as setUserAction, clearUser as clearUserAction, setLastUser as setLastUserAction } from '../store/userSlice'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u)
        const t = await u.getIdToken()
        setToken(t)
        dispatch(setUserAction({ uid: u.uid, email: u.email || null, displayName: u.displayName || null, photoURL: u.photoURL || null }))
      } else {
        setUser(null)
        setToken(null)
        dispatch(clearUserAction())
      }
      setLoading(false)
    })
    return unsub
  }, [dispatch])

  const signIn = async () => {
    await firebaseSignInWithPopup(auth, provider)
  }

  const signUpWithEmail = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signInWithEmail = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signOut = async () => {
    if (user) {
      dispatch(setLastUserAction({ uid: user.uid, email: user.email || null, displayName: user.displayName || null, photoURL: user.photoURL || null }))
    }
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut, signUpWithEmail, signInWithEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext



