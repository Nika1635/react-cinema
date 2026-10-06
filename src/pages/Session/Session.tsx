import { useEffect, useState } from "react"
import "./Session.css"
import SessionFilter, { type Filters, emptyFilters } from "./SessionFilter/SessionFilter.tsx"
import axios from "axios"
import SessionCard from "./SessionCard/SessionCard.tsx"

const API_URL = "https://api.kinoxii.redberryinternship.ge/api"

const buildQuery = (filters: Filters) => {
    const params = new URLSearchParams()
    if (filters.date) params.set("date", filters.date)
    filters.venues.forEach((id) => params.append("venues[]", String(id)))
    filters.formats.forEach((id) => params.append("formats[]", String(id)))
    filters.languages.forEach((id) => params.append("languages[]", String(id)))
    filters.bands.forEach((band) => params.append("bands[]", band))
    return params.toString()
}

export default function Session() {
    const [sessionData, setSessionData] = useState<any[]>([])
    const [filters, setFilters] = useState<Filters>(emptyFilters)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let ignore = false
        setLoading(true)
        setError(null)

        axios
            .get(`${API_URL}/sessions?${buildQuery(filters)}`)
            .then((res) => {
                if (!ignore) setSessionData(res.data.data ?? [])
            })
            .catch((err) => {
                if (!ignore) {
                    console.error(err)
                    setError("Could not load sessions. Please try again.")
                }
            })
            .finally(() => {
                if (!ignore) setLoading(false)
            })

        return () => {
            ignore = true
        }
    }, [filters])

    return (
        <div className="session-hero">
            <div className="filter-section">
                <h1>Sessions</h1>
                <p>Browse showtimes across all venues</p>
                <SessionFilter
                    filters={filters}
                    onChange={setFilters}
                    onClear={() => setFilters(emptyFilters)}
                />
            </div>

            <div className="session-list">
                <div className="session-list-header">
                    <p>Showing {sessionData.length} sessions</p>
                    <div>
                        <label htmlFor="sort">Sort:</label>
                        <select name="sort" id="sort">
                        </select>
                    </div>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="session-error">{error}</p>}
                {!loading && !error && sessionData.length === 0 && (
                    <p>No sessions match your filters.</p>
                )}

                <div className="session-list-card">
                    {sessionData.map((item) => (
                        <SessionCard
                            key={item.movie.id}
                            movie={item.movie}
                            sessions={item.sessions}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}