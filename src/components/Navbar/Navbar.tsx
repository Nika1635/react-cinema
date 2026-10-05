import "./Navbar.css"
import LogInModal from "../Modals/LogInModal/LogInModal.tsx"
import { useState } from "react"

export default function Navbar(){
    const [logInModalState, setLogInModalState] = useState<boolean>(false)

    function changelogInModalState(){
        setLogInModalState(prev => prev = !prev)
    }
    
    return(
        <div className="nav-wrapper">
           {logInModalState ? (<LogInModal onClose={changelogInModalState} />) : null}
            <header className="nav-section">
                
                <div className="nav-header">
                    <a>
                        <h1>KINO <span style={{color: "red"}}>XII</span></h1>
                        <h2>session</h2>
                    </a>
                </div>

                <nav>
                    <input type="text" className="searchBar"/>
                    <div className="account">
                        <button className="signUp">Sign Up</button>
                        <button className="logIn" onClick={changelogInModalState}>Log In</button>
                    </div>
                </nav>
            </header>
        </div>
    )
}