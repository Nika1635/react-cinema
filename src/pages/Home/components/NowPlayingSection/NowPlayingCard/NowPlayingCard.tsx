import "./NowPlayingCard.css"

type NowPlayingCardProps = {
    cardPhoto: string;
    cardName: string;
    cardDuration: string;
    cardPg: string;
    cardPrice: number;
    cardDesc: string;
    cardId: number;
};

export default function NowPlayingCard({cardPhoto, cardName, cardDuration, cardPg, cardDesc, cardPrice, cardId}: NowPlayingCardProps){
    return(
        <div className="nowplaying-card-hero">
            <div className="nowplaying-card-content">
                <img src={cardPhoto} alt={cardName} />
                <div className="nowplaying-card-info">
                    <h3>{cardName}</h3>
                    <h4>{cardDuration}</h4>
                    <h5>{cardPg}</h5>
                    <p>{cardDesc}</p>
                </div>
                <div>
                    <p>From {cardPrice}</p>
                    <button>Buy Ticket</button>
                </div>
            </div>
        </div>
    )
}