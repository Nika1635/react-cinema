import "./LogInModal.css"
import { useState } from "react"
import { logInUser } from "../../../services/authApi.ts"
import { useAuth } from "../../../services/AuthContext.tsx"

type LogInModalProps = {
    onClose: () => void
    onSwitch: () => void
}

export default function LogInModal({ onClose, onSwitch }: LogInModalProps){
    const { login } = useAuth()
    const [error, setError] = useState<string>("")
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        logInUser(formData)
            .then((res: any) => {
                console.log(res.data)
                const token = res.data.token ?? res.data.data?.token
                return login(token)
            })
            .then(() => onClose())
            .catch((err: any) => {
                console.log(err.response?.data)
                setError("Invalid email or password")
            })
    }

    return(
        <div className="modal-hero">
            <div className="auth-modal-hero">
                <div className="auth-modal-header">
                    <div>
                        <h1>Log in</h1>
                        <h3>Welcome back to Kino XII</h3>
                    </div>
                    <button onClick={onClose} className="auth-modal-close" type="button" aria-label="Close">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
                <div>
                    <form className="logIn-modal-form" onSubmit={handleSubmit} noValidate>
                        <div className="logIn-modal-inputfields">
                            <div>
                                <label htmlFor="email">Email</label>
                                <div className="logIn-modal-inputwrap">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="example@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password">Password</label>
                                <div className="logIn-modal-inputwrap">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="logIn-modal-actions">
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <button type="submit">Log in</button>
                            <p>Don't have an account? <a onClick={onSwitch}>Sign up</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}