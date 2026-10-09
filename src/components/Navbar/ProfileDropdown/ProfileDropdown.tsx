import "./ProfileDropdown.css"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"

type ProfileDropdownProps = {
    user: any;
    onLogout: () => void;
};

export default function ProfileDropdown({ user, onLogout }: ProfileDropdownProps){
    const [open, setOpen] = useState<boolean>(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    const initials = user.username
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

    const firstName = user.username.split(" ")[0]

    const profileComplete = Boolean(user.avatar)

    const go = (path: string) => {
        setOpen(false)
        navigate(path)
    }

    const avatar = (
        <div className="profile-menu-avatar">
            {user.avatar
                ? <img src={user.avatar} alt={user.username} />
                : <span>{initials}</span>}
            <span className={`profile-menu-dot ${profileComplete ? "profile-menu-dot-complete" : ""}`}></span>
        </div>
    )

    return(
        <div className="profile-menu-hero" ref={wrapperRef}>

            <button className="profile-menu-trigger" onClick={() => setOpen(prev => !prev)}>
                {avatar}
                <span className="profile-menu-name">{firstName}</span>
                <svg className="profile-menu-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {open && (
                <div className="profile-menu-panel">
                    <div className="profile-menu-user">
                        {avatar}
                        <div className="profile-menu-info">
                            <h4 className="profile-menu-fullname">{user.username}</h4>
                            <p className="profile-menu-email">{user.email}</p>
                        </div>
                    </div>

                    {profileComplete && (
                        <div className={`profile-menu-status ${profileComplete ? "profile-menu-status-complete" : "profile-menu-status-incomplete"}`}>
                            {profileComplete ? (
                                <>
                                    <span className="profile-menu-status-title">Profile Complete</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                </>
                            ) : (
                                <>
                                    <h5 className="profile-menu-status-title">Profile incomplete</h5>
                                    <p className="profile-menu-status-text">Please complete your profile to enable booking</p>
                                </>
                            )}
                        </div>
                    )}

                    <div className="profile-menu-list">
                        <button className="profile-menu-item" onClick={() => go("/profile")}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21a8 8 0 0 1 16 0" />
                            </svg>
                            My Profile
                        </button>
                        <button className="profile-menu-item" onClick={() => go("/tickets")}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                            </svg>
                            My Tickets
                        </button>
                    </div>

                    <div className="profile-menu-footer">
                        <button
                            className="profile-menu-item profile-menu-logout"
                            onClick={() => { setOpen(false); onLogout() }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <path d="m16 17 5-5-5-5" />
                                <path d="M21 12H9" />
                            </svg>
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}