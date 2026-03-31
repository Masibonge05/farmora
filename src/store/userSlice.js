import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  current: null, // currently authenticated user (non-sensitive)
  last: null, // last known user info persisted across logout
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.current = action.payload
    },
    clearUser(state) {
      state.current = null
    },
    setLastUser(state, action) {
      state.last = action.payload
    },
    clearLastUser(state) {
      state.last = null
    }
  }
})

export const { setUser, clearUser, setLastUser, clearLastUser } = userSlice.actions
export default userSlice.reducer
