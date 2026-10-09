import "./Navbar.css"
import { useEffect, useState } from "react"
import { useAuth } from "../../services/AuthContext.tsx"
import axios from "axios"
import LogInModal from "../Modals/LogInModal/LogInModal.tsx"
import SignUpModal from "../Modals/SignUpModal/SignUpModal.tsx"
import SearchDropdown from "./SearchDropdown/SearchDropdown.tsx"
import ProfileDropdown from "./ProfileDropdown/ProfileDropdown.tsx"

export default function Navbar(){
    const { user, logout } = useAuth()

    const [logInModalState, setLogInModalState] = useState<boolean>(false)
    const [signUpModalState, setSignUpModalState] = useState<boolean>(false)

    const [searchFocused, setSearchFocused] = useState<boolean>(false)
    const [query, setQuery] = useState<string>("")
    const [results, setResults] = useState<any[]>([])

    function changeSignUpModalState(){
        setLogInModalState(false)
        setSignUpModalState(prev => !prev)
    }

    function changelogInModalState(){
        setSignUpModalState(false)
        setLogInModalState(prev => !prev)
    }

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
            {signUpModalState && (
                <SignUpModal
                    onClose={() => setSignUpModalState(false)}
                    onSwitch={changelogInModalState}
                />
            )}
            {logInModalState && (
                <LogInModal
                    onClose={() => setLogInModalState(false)}
                    onSwitch={changeSignUpModalState}
                />
            )}

            <header className="nav-section">
                <div className="nav-header">
                    <a>
                        <h1>KINO <span style={{color: "red"}}>XII</span></h1>
                        <h2>session</h2>
                    </a>
                </div>

                <nav>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="searchBar"
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

                    {user ? 
                        (
                            <ProfileDropdown user={user} onLogout={logout} />
                        ) : (
                            <div className="account">
                                <button className="signUp" onClick={changeSignUpModalState}>Sign Up</button>
                                <button className="logIn" onClick={changelogInModalState}>Log In</button>
                            </div>
                        )
                    }
                </nav>
            </header>
        </div>
    )
}