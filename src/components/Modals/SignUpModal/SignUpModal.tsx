import "./SignUpModal.css"
import { useState } from "react";

type SignUpModalProps = {
    onClose: () => void
    onSwitch: () => void
};

export default function SignUpModal({ onClose, onSwitch }: SignUpModalProps){
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
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
        console.log(formData)
    }

    return(
        <div className="modal-hero">
            <div className="auth-modal-hero signUp-modal-hero">
                <div className="auth-modal-header">
                    <div>
                        <h1>Sign up</h1>
                        <h3>Welcome to Kino XII</h3>
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

                            <div className="signUp-modal-avatar">
                                <div className="signUp-modal-avatar-photo">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 21a8 8 0 0 1 16 0" />
                                    </svg>
                                </div>
                                <div className="signUp-modal-avatar-text">
                                    <h4>Upload avatar (optional)</h4>
                                    <p>JPG, PNG or WEBP</p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username">Username</label>
                                <div className="logIn-modal-inputwrap">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="User"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

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

                            <div className="signUp-modal-row">
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
                                <div>
                                    <label htmlFor="confirmPassword">Confirm password</label>
                                    <div className="logIn-modal-inputwrap">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="logIn-modal-actions">
                            <button type="submit">Sign up</button>
                            <p>Already have an account? <a onClick={onSwitch}>Log in</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}