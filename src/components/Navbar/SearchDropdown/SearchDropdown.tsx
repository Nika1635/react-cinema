import "./SearchDropdown.css"
import { useNavigate } from "react-router"

type SearchDropdownProps = {
    query: string;
    results: any[];
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export default function SearchDropdown({ query, results }: SearchDropdownProps){
    const navigate = useNavigate()

    return(
        <div className="search-dropdown-hero">
            {query === "" && (
                <div className="search-dropdown-empty">
                    <div className="search-dropdown-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2"
                             strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 10h12l-1.5 11h-9z" />
                            <path d="M6 10a3 3 0 0 1 3-4 3 3 0 0 1 6 0 3 3 0 0 1 3 4" />
                        </svg>
                    </div>
                    <h4 className="search-dropdown-empty-title">What do you want to watch?</h4>
                    <p className="search-dropdown-empty-text">Search by title, director or cast</p>
                    <button className="search-dropdown-button" onClick={() => navigate("/sessions")}>
                        Browse all sessions
                    </button>
                </div>
            )}

            {query !== "" && results.length > 0 && (
                <div className="search-dropdown-results">
                    <div className="search-dropdown-header">
                        <h5 className="search-dropdown-label">Films &amp; Events</h5>
                        <span className="search-dropdown-count">{results.length} results</span>
                    </div>

                    <div className="search-dropdown-list">
                        {results.map((movie) => {
                            const startsWithQuery = movie.title.toLowerCase().startsWith(query.toLowerCase())
                            const matched = startsWithQuery ? movie.title.slice(0, query.length) : movie.title
                            const rest = startsWithQuery ? movie.title.slice(query.length) : ""

                            return (
                                <div
                                    className="search-dropdown-item"
                                    key={movie.id}
                                    onClick={() => navigate(`/movies/${movie.id}`)}
                                >
                                    <img className="search-dropdown-poster" src={movie.posterUrl} alt={movie.title} />
                                    <div className="search-dropdown-info">
                                        <h4 className="search-dropdown-title">
                                            <span className="search-dropdown-match">{matched}</span>
                                            <span className="search-dropdown-rest">{rest}</span>
                                        </h4>
                                        <p className="search-dropdown-meta">
                                            {capitalize(movie.kind)} · {movie.ageRating.code} · {movie.runtimeMinutes} min
                                        </p>
                                    </div>
                                    {movie.isComingSoon ? (
                                        <span className="search-dropdown-price search-dropdown-price-soon">Coming Soon</span>
                                    ) : (
                                        <span className="search-dropdown-price">from ₾{movie.fromPrice}</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {query !== "" && results.length === 0 && (
                <div className="search-dropdown-empty">
                    <div className="search-dropdown-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2"
                             strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3.5-3.5" />
                        </svg>
                    </div>
                    <h4 className="search-dropdown-empty-title">No results for “{query}”</h4>
                    <p className="search-dropdown-empty-text">Check the spelling or try another film or live event.</p>
                    <button className="search-dropdown-button" onClick={() => navigate("/session")}>
                        Browse all sessions
                    </button>
                </div>
            )}

        </div>
    )
}