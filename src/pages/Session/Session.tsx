import { useEffect, useState } from "react"
import "./Session.css"
import SessionFilter, { type Filters, emptyFilters } from "./SessionFilter/SessionFilter.tsx"
import axios from "axios"
import SessionCard from "./SessionCard/SessionCard.tsx"

const API_URL = "https://api.kinoxii.redberryinternship.ge/api"

type Meta = {
    currentPage: number
    lastPage: number
    perPage: number
    totalSessions: number
    totalMovies: number
    date: string
}

const buildQuery = (filters: Filters, page: number) => {
    const params = new URLSearchParams()
    if (filters.date) params.set("date", filters.date)
    filters.venues.forEach((slug) => params.append("venues[]", slug))
    filters.formats.forEach((slug) => params.append("formats[]", slug))
    filters.languages.forEach((slug) => params.append("languages[]", slug))
    filters.bands.forEach((band) => params.append("bands[]", band))
    params.set("page", String(page))
    return params.toString()
}

export default function Session() {
    const [sessionData, setSessionData] = useState<any[]>([])
    const [meta, setMeta] = useState<Meta | null>(null)
    const [filters, setFilters] = useState<Filters>(emptyFilters)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const handleFilterChange = (next: Filters) => {
        setFilters(next)
        setPage(1)
    }

    useEffect(() => {
        let ignore = false
        setLoading(true)
        setError(null)

        axios
            .get(`${API_URL}/sessions?${buildQuery(filters, page)}`)
            .then((res) => {
                if (ignore) return
                setSessionData(res.data.data ?? [])
                setMeta(res.data.meta ?? null)
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
    }, [filters, page])

    return (
        <div className="session-hero">
            <div className="filter-section">
                <h1>Sessions</h1>
                <p>Browse showtimes across all venues</p>
                <SessionFilter
                    filters={filters}
                    onChange={handleFilterChange}
                    onClear={() => handleFilterChange(emptyFilters)}
                />
            </div>

            <div className="session-list">
                <div className="session-list-header">
                    <p>
                        Showing {meta?.totalSessions ?? 0} sessions
                        {meta ? ` across ${meta.totalMovies} movies` : ""}
                    </p>
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
            </div>
        </div>
    )
}