import "./Navbar.css"
import LogInModal from "../Modals/LogInModal/LogInModal.tsx"
import SignUpModal from "../Modals/SignUpModal/SignUpModal.tsx"
import { useState, useEffect } from "react"
import SearchDropdown from "./SearchDropdown/SearchDropdown.tsx"
import axios from "axios"

export default function Navbar(){
    const [logInModalState, setLogInModalState] = useState<boolean>(false)
    const [signUpModalState, setSignUpModalState] = useState<boolean>(false)
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

    function changeSignUpModalState(){
        setLogInModalState(false)
        setSignUpModalState(prev => !prev)
    }

    function changelogInModalState(){
        setSignUpModalState(false)
        setLogInModalState(prev => !prev)
    }
    
    return(
        <div className="nav-wrapper">
            {signUpModalState ? (<SignUpModal 
                onClose={changeSignUpModalState} 
                onSwitch={changelogInModalState}
            
            />) : null}
            {logInModalState ? (<LogInModal 
                onClose={changelogInModalState}
                onSwitch={changeSignUpModalState}
            />) : null}
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
                                    <SearchDropdown query={query.trim()} results={results}/>
                                </div>
                            )}
                    </div>
                    <div className="account">
                        <button className="signUp" onClick={changeSignUpModalState}>Sign Up</button>
                        <button className="logIn" onClick={changelogInModalState}>Log In</button>
                    </div>
                </nav>
            </header>
        </div>
    )
}