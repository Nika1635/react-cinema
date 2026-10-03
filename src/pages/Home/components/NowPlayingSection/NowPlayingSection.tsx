import "./NowPlayingSection.css"
import NowPlayingCard from "./NowPlayingCard/NowPlayingCard.tsx"



export default function NowPlayingSection(){
    return(
        <section className="movie-section">
            <div className="movie-section-title">
                <h3>NOW PLAYING</h3>
                <a>See all</a>
            </div>
            <div className="movie-section-movielist">
                <NowPlayingCard
                    cardPhoto="hello"
                    cardName="name"
                    cardDuration="123"
                    cardPg="1231212+"
                    cardPrice={123}
                    cardDesc="While her husband maps a coast he will never sail, she keeps a second atlas of the places he leaves out, and it becomes the more accurate of the two"
                    cardId={12}
                />
            </div>
        </section>
    )
}