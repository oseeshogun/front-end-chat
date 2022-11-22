import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
  token: '',
  isAuthenticated: false,
  users: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload
    },
    setUser: (state, { payload }) => {
      console.log(payload)
      state.data = payload
    },
    setIsAuthenticated: (state, { payload }) => {
      state.isAuthenticated = payload
    },
    setUsers: (state, { payload }) => {
      state.users = payload
    },
    setAvatar: (state, { payload }) => {
      state.data = { ...state.data, avatar: payload }
    },
  },
})

export const { setUser, setUsers, setIsAuthenticated, setToken, setAvatar } =
  userSlice.actions

export default userSlice.reducer
