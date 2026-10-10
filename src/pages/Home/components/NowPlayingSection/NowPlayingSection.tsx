import "./NowPlayingSection.css"
import NowPlayingCard from "./NowPlayingCard/NowPlayingCard.tsx"
import { useEffect, useState } from "react"
import axios from "axios";
import ScrollContainer from "react-indiana-drag-scroll"



export default function NowPlayingSection(){

    const [nowPlayingList, setNowPlayingList] = useState<any>([])


    useEffect(() => {
        axios.get<any>("https://api.kinoxii.redberryinternship.ge/api/movies/now-playing")
        .then((res) => {
            setNowPlayingList(res.data.data)
        })
    
    }, [])

    return(
        <section className="movie-section">
            <div className="movie-section-title">
                <h3>NOW PLAYING</h3>
                <a>See all</a>
            </div>
            <ScrollContainer className="movie-section-movielist">
                {
                    nowPlayingList.map((data: any) => (
                            <NowPlayingCard key={data.id}
                                cardPhoto={data.posterUrl}
                                cardName={data.title}
                                cardDuration={data.runtimeMinutes}
                                cardPg={data.ageRating.code}
                                cardPrice={123}
                                cardDesc={data.synopsis}
                                cardGenre={data.genres[0].name}
                                cardSlug={data.slug}
                            />
                    ))
                }
            </ScrollContainer>

        </section>
    )
}