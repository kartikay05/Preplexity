import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        error: false
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        logout: (state) => {
            state.user = null
            state.error = false
        }
    }
})

export const { setUser, setLoading, setError, logout } = authSlice.actions
export default authSlice.reducer