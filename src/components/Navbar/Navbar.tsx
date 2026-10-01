import "./Navbar.css"

export default function Navbar(){
    return(
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
                    <button className="logIn">Log In</button>
                </div>
            </nav>
        </header>
    )
}