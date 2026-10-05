import "./Navbar.css"
import LogInModal from "../Modals/LogInModal/LogInModal.tsx"
import SignUpModal from "../Modals/SignUpModal/SignUpModal.tsx"
import { useState } from "react"

export default function Navbar(){
    const [logInModalState, setLogInModalState] = useState<boolean>(false)
    const [signUpModalState, setSignUpModalState] = useState<boolean>(true)

    function changeSignUpModalState(){
        setLogInModalState(prev => prev = false)
        setSignUpModalState(prev => prev = !prev)
    }

    function changelogInModalState(){
        setSignUpModalState(prev => prev = false)
        setLogInModalState(prev => prev = !prev)
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
                    <input type="text" className="searchBar"/>
                    <div className="account">
                        <button className="signUp" onClick={changeSignUpModalState}>Sign Up</button>
                        <button className="logIn" onClick={changelogInModalState}>Log In</button>
                    </div>
                </nav>
            </header>
        </div>
    )
}