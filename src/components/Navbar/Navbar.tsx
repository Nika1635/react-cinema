import "./Navbar.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { useAuth } from "../../services/AuthContext.tsx"
import { useAuthModal } from "../../services/AuthModalContext.tsx"
import SearchDropdown from "./SearchDropdown/SearchDropdown.tsx"
import ProfileDropdown from "./ProfileDropdown/ProfileDropdown.tsx"

export default function Navbar(){
    const { user, logout } = useAuth()
    const { openLogin, openSignUp } = useAuthModal()
    const navigate = useNavigate()
    const [searchFocused, setSearchFocused] = useState<boolean>(false)
    const [query, setQuery] = useState<string>("")
    const [results, setResults] = useState<any[]>([])

    useEffect(() => {
        const trimmed = query.trim()

        if (trimmed === "") {
            setResults([])
            return
        }

        let ignore = false

        const timer = setTimeout(() => {
            axios.get("https://api.kinoxii.redberryinternship.ge/api/sessions", {
                params: { search: trimmed },
            })
            .then((res) => {
                if (!ignore) setResults(res.data.data.map((item: any) => item.movie))
            })
        }, 300)

        return () => {
            ignore = true
            clearTimeout(timer)
        }
    }, [query])

    return(
        <div className="nav-wrapper">
            <header className="nav-section">
                <div className="nav-header">
                    <div>
                        <h1 onClick={() => navigate("/")}>KINO <span style={{color: "red"}}>XII</span></h1>
                        <a onClick={() => navigate("/sessions")}>session</a>
                    </div>
                </div>

                <nav>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="searchBar"
                            placeholder="Search films and live events"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />

                        {searchFocused && (
                            <div onMouseDown={(e) => e.preventDefault()}>
                                <SearchDropdown query={query.trim()} results={results} />
                            </div>
                        )}
                    </div>

                    {user ? (
                        <ProfileDropdown user={user} onLogout={logout} />
                    ) : (
                        <div className="account">
                            <button className="signUp" onClick={() => openSignUp()}>Sign Up</button>
                            <button className="logIn" onClick={() => openLogin()}>Log In</button>
                        </div>
                    )}
                </nav>
            </header>
        </div>
    )
}