import { createContext, useContext, useEffect, useState } from "react"
import { getMe } from "./authApi"

type AuthContextType = {
    user: any
    loading: boolean
    login: (token: string) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }){
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setLoading(false)
            return
        }

        getMe()
            .then((res) => setUser(res.data.data ?? res.data))
            .catch(() => {
                localStorage.removeItem("token")
                setUser(null)
            })
            .finally(() => setLoading(false))
    }, [])

    const login = async (token: string) => {
        localStorage.setItem("token", token)
        const res = await getMe()
        setUser(res.data.data ?? res.data)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    const refreshUser = async () => {
        const res = await getMe()
        setUser(res.data.data ?? res.data)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)