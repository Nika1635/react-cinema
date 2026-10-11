import { createContext, useContext, useEffect, useRef, useState } from "react"
import LogInModal from "../components/Modals/LogInModal/LogInModal.tsx"
import SignUpModal from "../components/Modals/SignUpModal/SignUpModal.tsx"
import { setUnauthorizedHandler } from "./unauthorized.ts"

type Ctx = {
    openLogin: (after?: () => void) => void
    openSignUp: (after?: () => void) => void
}

const AuthModalContext = createContext<Ctx>(null!)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
    const [modal, setModal] = useState<"login" | "signup" | null>(null)
    const afterRef = useRef<(() => void) | null>(null)

    const open = (type: "login" | "signup", after?: () => void) => {
        if (after) afterRef.current = after
        setModal(type)
    }

    const close = () => {
        afterRef.current = null
        setModal(null)
    }

    const success = () => {
        const after = afterRef.current
        afterRef.current = null
        setModal(null)
        after?.()
    }

    useEffect(() => {
    setUnauthorizedHandler(() => {
        localStorage.removeItem("token")
        return new Promise<boolean>((resolve) => {
            afterRef.current = () => resolve(true)
            setModal("login")
        })
    })
    }, [])

    return (
        <AuthModalContext.Provider value={{ openLogin: (a) => open("login", a), openSignUp: (a) => open("signup", a) }}>
            {children}
            {modal === "login" && <LogInModal onClose={close} onSwitch={() => setModal("signup")} onSuccess={success} />}
            {modal === "signup" && <SignUpModal onClose={close} onSwitch={() => setModal("login")} onSuccess={success} />}
        </AuthModalContext.Provider>
    )
}

export const useAuthModal = () => useContext(AuthModalContext)