import "./Session.css"
import SessionFilter from "./SessionFilter/SessionFilter.tsx"

export default function Session(){
    return (
        <div className="session-hero">
            <div className="filter-section">
                <h1>Sessions</h1>
                <p>Browse showtimes across all venues</p>
                <SessionFilter/>
            </div>
            <div className="session-list">
            </div>
        </div>
    )
}