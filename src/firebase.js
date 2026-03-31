import { initializeApp } from 'firebase/app'

// Auth
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Realtime DB
import { getDatabase } from 'firebase/database'

// ================= CONFIG =================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// ================= INIT =================
const app = initializeApp(firebaseConfig)

// Services
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getDatabase(app)

// ================= EXPORT =================
export { auth, provider, db }