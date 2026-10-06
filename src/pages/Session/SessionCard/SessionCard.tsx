import "./SessionCard.css"

type SessionCardProps = {
    movie: any;
    sessions: any[];
};

export default function SessionCard({ movie, sessions }: SessionCardProps){
    return(
        <div className="session-card-hero">
            <div className="session-card-movie">
                <img className="session-card-poster" src={movie.posterUrl} alt={movie.title} />
                <div className="session-card-movie-info">
                    <div className="session-card-movie-top">
                        <h3 className="session-card-title">{movie.title}</h3>
                        <span className="session-card-age">{movie.ageRating.code}</span>
                    </div>
                    <p className="session-card-meta">{movie.runtimeMinutes} min</p>
                </div>
            </div>

            <div className="session-card-list">
                {sessions.map((s) => (
                    <div
                        className={`session-card-item ${s.isSoldOut ? "session-card-item-soldout" : ""}`}
                        key={s.id}
                    >
                        <div className="session-card-top">
                            <h4 className="session-card-time">{s.time}</h4>
                            <span className="session-card-format">{s.format.name}</span>
                        </div>

                        <div className="session-card-details">
                            <div className="session-card-left">
                                <p className="session-card-language">{s.language.name}</p>
                                <p className="session-card-venue">{s.venue.name} · Hall {s.hall.name}</p>
                            </div>
                            <div className="session-card-right">
                                <div className={`session-card-seats ${s.seatsLeft <= 5 ? "session-card-seats-low" : ""}`}>
                                    <span className="session-card-seats-text">
                                        {s.isSoldOut ? "Sold out" : `${s.seatsLeft} left`}
                                    </span>
                                </div>
                                <h4 className="session-card-price">₾{s.price}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}