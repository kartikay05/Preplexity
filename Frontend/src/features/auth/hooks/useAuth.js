import { useDispatch } from "react-redux";
import { getMe, login, register } from "../service/auth.api";
import { setError, setLoading, setUser } from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister({ username, email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
            throw error
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ identifier, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ identifier, password })
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"))
            throw error
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user data"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { handleLogin, handleRegister, handleGetMe }
} 