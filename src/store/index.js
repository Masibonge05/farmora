import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './userSlice'

// Some bundlers / import interop can yield a storage object that doesn't
// directly expose the storage methods expected by redux-persist in the
// browser runtime. Provide a safe fallback to `window.localStorage` when
// the imported `storage` doesn't look correct.
let storageEngine = storage
try {
  if (!storage || typeof storage.getItem !== 'function') {
    if (typeof window !== 'undefined' && window.localStorage) {
      storageEngine = {
        getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
        setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
        removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
      }
    }
  }
} catch (e) {
  // Fall back to the imported storage if anything goes wrong
  storageEngine = storage
}

const rootReducer = combineReducers({ user: userReducer })

const persistConfig = {
  key: 'farmora_root',
  storage: storageEngine,
  whitelist: ['user'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export const persistor = persistStore(store)

export default store

