import "./Details.css"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import axios from "axios"
import { useAuth } from "../../services/AuthContext.tsx"

const BASE_URL = "https://api.kinoxii.redberryinternship.ge/api"

const getNextDays = () => {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() + i)
        return {
            value: d.toLocaleDateString("en-CA"), // YYYY-MM-DD
            weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
            day: d.getDate(),
        }
    })
}

const getAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth)
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    const hadBirthday =
        now.getMonth() > birth.getMonth() ||
        (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())
    if (!hadBirthday) age--
    return age
}

export default function Details() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const days = getNextDays()
    const [selectedDate, setSelectedDate] = useState<string>(days[0].value)
    const [movie, setMovie] = useState<any>(null)
    const [venues, setVenues] = useState<any[]>([])

    useEffect(() => {
        axios.get(`${BASE_URL}/movies/${slug}`)
            .then((res) => setMovie(res.data.data))
    }, [slug])

    useEffect(() => {
        let ignore = false

        axios.get(`${BASE_URL}/movies/${slug}/sessions`, { params: { date: selectedDate } })
            .then((res) => {
                if (!ignore) setVenues(res.data.data)
            })
            .catch(() => {
                if (!ignore) setVenues([])
            })

        return () => { ignore = true }
    }, [slug, selectedDate])

    if (!movie) return null
    const blocked =
        movie.ageRating.minAge >= 16 &&
        Boolean(user?.dateOfBirth) &&
        getAge(user.dateOfBirth) < movie.ageRating.minAge

    return (
        <div className="movie-details-page">

            {/* hero section */}
            <section className="movie-details-hero">
                <img className="movie-details-backdrop" src={movie.backdropUrl} alt="" />
                <div className="movie-details-hero-content">
                    <img className="movie-details-poster" src={movie.posterUrl} alt={movie.title} />
                    <div className="movie-details-main">
                        <span className="movie-details-status">
                            {movie.isComingSoon ? "Coming soon" : "Now playing"}
                        </span>

                        <div className="movie-details-text">
                            <div className="movie-details-heading">
                                <h1 className="movie-details-title">{movie.title}</h1>
                                <p className="movie-details-synopsis">{movie.synopsis}</p>
                            </div>

                            <div className="movie-details-badges">
                                <span className="movie-details-badge movie-details-badge-age">{movie.ageRating.code}</span>
                                <span className="movie-details-badge">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="13" r="8" />
                                        <path d="M12 9v4l2 2" />
                                        <path d="M9 2h6" />
                                    </svg>
                                    {movie.runtimeMinutes} Min
                                </span>
                                {movie.genres.map((g: any) => (
                                    <span className="movie-details-badge" key={g.id}>{g.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="movie-details-body">

                {/* sessions section */}
                <section className="movie-details-sessions">
                    <h2 className="movie-details-section-title">Sessions</h2>

                    <div className="movie-details-dates">
                        {days.map((d) => (
                            <button
                                key={d.value}
                                className={`movie-details-date ${selectedDate === d.value ? "movie-details-date-active" : ""}`}
                                onClick={() => setSelectedDate(d.value)}
                            >
                                <span className="movie-details-date-weekday">{d.weekday}</span>
                                <span className="movie-details-date-day">{d.day}</span>
                            </button>
                        ))}
                    </div>

                    {blocked && (
                        <p className="movie-details-blocked-note">
                            This film is rated {movie.ageRating.code}. You cannot buy tickets for it with this account.
                        </p>
                    )}

                    {venues.length === 0 ? (
                        <p className="movie-details-empty">No sessions available for this date.</p>
                    ) : (
                        <div className="movie-details-venues">
                            {venues.map((v) => {
                                const hallNames = [...new Set(v.sessions.map((s: any) => s.hall.name))] as string[]

                                return (
                                    <div className="movie-details-venue" key={v.venue.id}>
                                        <h3 className="movie-details-venue-name">{v.venue.name}</h3>

                                        <div className="movie-details-halls">
                                            {hallNames.map((hallName) => {
                                                const hallSessions = v.sessions.filter((s: any) => s.hall.name === hallName)

                                                return (
                                                    <div className="movie-details-hall" key={hallName}>
                                                        <h4 className="movie-details-hall-name">Hall {hallName}</h4>

                                                        <div className="movie-details-hall-sessions">
                                                            {hallSessions.map((s: any) => (
                                                                <button
                                                                    key={s.id}
                                                                    className={`movie-details-ticket ${blocked || s.isSoldOut ? "movie-details-ticket-disabled" : ""}`}
                                                                    disabled={blocked || s.isSoldOut}
                                                                    onClick={() => navigate(`/booking/${s.id}`)}
                                                                >
                                                                    <div className="movie-details-ticket-left">
                                                                        <h5 className="movie-details-ticket-time">{s.time}</h5>
                                                                        <div className="movie-details-ticket-meta">
                                                                            <span className="movie-details-ticket-language">{s.language.code}</span>
                                                                            <span className="movie-details-ticket-format">{s.format.name}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="movie-details-ticket-right">
                                                                        <span className="movie-details-ticket-price">₾{s.price}</span>
                                                                        <span className="movie-details-ticket-seats">
                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                                                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                                                                            </svg>
                                                                            {s.isSoldOut ? "Sold out" : `${s.seatsLeft} left`}
                                                                        </span>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* details bar */}
                <div className="movie-details-info">
                    <h2 className="movie-details-section-title">Details</h2>

                    <div className="movie-details-info-item">
                        <h6>Director</h6>
                        <p>{movie.director}</p>
                    </div>
                    <div className="movie-details-info-item">
                        <h6>Main cast</h6>
                        <p>{Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast}</p>
                    </div>
                    <div className="movie-details-info-item">
                        <h6>Duration</h6>
                        <p>{movie.runtimeMinutes} minutes</p>
                    </div>
                    <div className="movie-details-info-item">
                        <h6>Release date</h6>
                        <p>{new Date(movie.releaseDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <div className="movie-details-info-item">
                        <h6>Formats</h6>
                        <p>{movie.formats.map((f: any) => f.name).join(", ")}</p>
                    </div>
                    <div className="movie-details-info-item">
                        <h6>From</h6>
                        <p>₾{movie.fromPrice}</p>
                    </div>

                    <div className="movie-details-rating">
                        <h6>Rating note</h6>
                        <div className="movie-details-rating-row">
                            <span className="movie-details-rating-code">{movie.ageRating.code}</span>
                            <p>{movie.ageRating.description}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}