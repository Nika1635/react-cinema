import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import "./Session.css"
import SessionFilter, { type Filters, emptyFilters } from "./SessionFilter/SessionFilter.tsx"
import axios from "axios"
import SessionCard from "./SessionCard/SessionCard.tsx"
import Pagination from "./Pagination/Pagination.tsx"

const API_URL = "https://api.kinoxii.redberryinternship.ge/api"

type Meta = {
    currentPage: number
    lastPage: number
    perPage: number
    totalSessions: number
    totalMovies: number
    date: string
}

const sortOptions = [
    { value: "", label: "Default" },
    { value: "price_asc", label: "Price: low to high" },
    { value: "price_desc", label: "Price: high to low" },
]

const toList = (value: string | null) => (value ? value.split(",").filter(Boolean) : [])

const parseUrl = (search: string) => {
    const sp = new URLSearchParams(search)
    const filters: Filters = {
        date: sp.get("date") ?? "",
        venues: toList(sp.get("venue")),
        formats: toList(sp.get("format")),
        languages: toList(sp.get("language")),
        bands: toList(sp.get("time")),
    }
    const page = Math.max(1, Number(sp.get("page")) || 1)
    const sort = sp.get("sort") ?? ""
    return { filters, page, sort }
}

const buildUrlSearch = (filters: Filters, page: number, sort: string) => {
    const sp = new URLSearchParams()
    if (filters.date) sp.set("date", filters.date)
    if (filters.venues.length) sp.set("venue", filters.venues.join(","))
    if (filters.formats.length) sp.set("format", filters.formats.join(","))
    if (filters.languages.length) sp.set("language", filters.languages.join(","))
    if (filters.bands.length) sp.set("time", filters.bands.join(","))
    if (sort) sp.set("sort", sort)
    if (page > 1) sp.set("page", String(page))
    const str = sp.toString().replace(/%2C/g, ",")
    return str ? `?${str}` : ""
}

const buildApiQuery = (filters: Filters, page: number, sort: string) => {
    const params = new URLSearchParams()
    if (filters.date) params.set("date", filters.date)
    filters.venues.forEach((slug) => params.append("venues[]", slug))
    filters.formats.forEach((slug) => params.append("formats[]", slug))
    filters.languages.forEach((slug) => params.append("languages[]", slug))
    filters.bands.forEach((band) => params.append("bands[]", band))
    if (sort) params.set("sort", sort)
    params.set("page", String(page))
    return params.toString()
}

export default function Session() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const search = searchParams.toString()

    const { filters, page, sort } = useMemo(() => parseUrl(search), [search])

    const [sessionData, setSessionData] = useState<any[]>([])
    const [meta, setMeta] = useState<Meta | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const updateUrl = (nextFilters: Filters, nextPage: number, nextSort: string) => {
        navigate({ search: buildUrlSearch(nextFilters, nextPage, nextSort) })
    }

    const handleFilterChange = (next: Filters) => updateUrl(next, 1, sort)
    const handleSortChange = (next: string) => updateUrl(filters, 1, next)
    const handlePageChange = (next: number) => {
        updateUrl(filters, next, sort)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    useEffect(() => {
        let ignore = false
        setLoading(true)
        setError(null)

        axios
            .get(`${API_URL}/sessions?${buildApiQuery(filters, page, sort)}`)
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
    }, [filters, page, sort])

    return (
        <div className="session-hero">
            <div className="filter-section">
                <h1>Sessions</h1>
                <p>Browse showtimes across all venues</p>
                <SessionFilter
                    filters={filters}
                    onChange={handleFilterChange}
                    onClear={() => updateUrl(emptyFilters, 1, sort)}
                />
            </div>

            <div className="session-list">
                <div className="session-list-header">
                    <p>
                        Showing {meta?.totalSessions ?? 0} sessions
                        {meta ? ` across ${meta.totalMovies} movies` : ""}
                    </p>
                    <div>
                        <label htmlFor="session-sort">Sort by</label>
                        <select
                            id="session-sort"
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value)}
                        >
                            {sortOptions.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
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

                {meta && meta.lastPage > 1 && (
                    <div className="session-pagination">
                        <Pagination
                            currentPage={meta.currentPage}
                            lastPage={meta.lastPage}
                            onPageChange={handlePageChange}
                            disabled={loading}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}