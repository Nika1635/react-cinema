import "./ComingSoonCard.css"

type ComingSoonCardProps = {
    cardPhoto: string;
    cardName: string;
    cardGenre: string;
    cardDuration: number;
    cardPg: string;
    cardDate: string;
};

export default function ComingSoonCard({cardPhoto, cardName, cardGenre, cardDuration, cardPg, cardDate}: ComingSoonCardProps){
    return(
        <div className="comingsoon-card-hero">
            <img src={cardPhoto} alt={cardName} />
            <div className="comingsoon-card-content">
                <div className="comingsoon-card-info">
                    <p>IN CINEMAS {cardDate}</p>
                    <h3>{cardName}</h3>
                    <h4>{cardGenre} · {cardDuration} min</h4>
                    <h5>{cardPg}</h5>
                </div>
                <button>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    Notify Me
                </button>
            </div>
        </div>
    )
}