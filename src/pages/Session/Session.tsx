import { useEffect, useState } from "react"
import "./Session.css"
import SessionFilter, { type Filters, emptyFilters } from "./SessionFilter/SessionFilter.tsx"
import axios from "axios"
import SessionCard from "./SessionCard/SessionCard.tsx"

const API_URL = "https://api.kinoxii.redberryinternship.ge/api"

<<<<<<< HEAD
const buildQuery = (filters: Filters) => {
=======
type Meta = {
    currentPage: number
    lastPage: number
    perPage: number
    totalSessions: number
    totalMovies: number
    date: string
}

const buildQuery = (filters: Filters, page: number) => {
>>>>>>> df8f03b (sessionPage/filtering)
    const params = new URLSearchParams()
    if (filters.date) params.set("date", filters.date)
    filters.venues.forEach((id) => params.append("venues[]", String(id)))
    filters.formats.forEach((id) => params.append("formats[]", String(id)))
    filters.languages.forEach((id) => params.append("languages[]", String(id)))
    filters.bands.forEach((band) => params.append("bands[]", band))
<<<<<<< HEAD
=======
    params.set("page", String(page))
>>>>>>> df8f03b (sessionPage/filtering)
    return params.toString()
}

export default function Session() {
    const [sessionData, setSessionData] = useState<any[]>([])
<<<<<<< HEAD
    const [filters, setFilters] = useState<Filters>(emptyFilters)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

=======
    const [meta, setMeta] = useState<Meta | null>(null)
    const [filters, setFilters] = useState<Filters>(emptyFilters)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const handleFilterChange = (next: Filters) => {
        setFilters(next)
        setPage(1)
    }

>>>>>>> df8f03b (sessionPage/filtering)
    useEffect(() => {
        let ignore = false
        setLoading(true)
        setError(null)

        axios
<<<<<<< HEAD
            .get(`${API_URL}/sessions?${buildQuery(filters)}`)
            .then((res) => {
                if (!ignore) setSessionData(res.data.data ?? [])
=======
            .get(`${API_URL}/sessions?${buildQuery(filters, page)}`)
            .then((res) => {
                if (ignore) return
                setSessionData(res.data.data ?? [])
                setMeta(res.data.meta ?? null)
>>>>>>> df8f03b (sessionPage/filtering)
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
<<<<<<< HEAD
    }, [filters])
=======
    }, [filters, page])
>>>>>>> df8f03b (sessionPage/filtering)

    return (
        <div className="session-hero">
            <div className="filter-section">
                <h1>Sessions</h1>
                <p>Browse showtimes across all venues</p>
                <SessionFilter
                    filters={filters}
<<<<<<< HEAD
                    onChange={setFilters}
                    onClear={() => setFilters(emptyFilters)}
=======
                    onChange={handleFilterChange}
                    onClear={() => handleFilterChange(emptyFilters)}
>>>>>>> df8f03b (sessionPage/filtering)
                />
            </div>

            <div className="session-list">
                <div className="session-list-header">
<<<<<<< HEAD
                    <p>Showing {sessionData.length} sessions</p>
                    <div>
                        <label htmlFor="sort">Sort:</label>
                        <select name="sort" id="sort">
                        </select>
=======
                    <p>
                        Showing {meta?.totalSessions ?? 0} sessions
                        {meta ? ` across ${meta.totalMovies} movies` : ""}
                    </p>
                    <div>
                        <label htmlFor="sort">Sort:</label>
                        <select name="sort" id="sort"></select>
>>>>>>> df8f03b (sessionPage/filtering)
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
<<<<<<< HEAD
=======

                {meta && meta.lastPage > 1 && (
                    <div className="session-pagination">
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </button>
                        <span>
                            Page {meta.currentPage} of {meta.lastPage}
                        </span>
                        <button
                            type="button"
                            disabled={page >= meta.lastPage || loading}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
>>>>>>> df8f03b (sessionPage/filtering)
            </div>
        </div>
    )
}