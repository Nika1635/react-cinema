import ComingSoonCard from "./ComingSoonCard/ComingSoonCard";
import { useEffect, useState } from "react"
import axios from "axios";
import ScrollContainer from "react-indiana-drag-scroll"



export default function ComingSoonSection(){

    const [comingSoonList, setComingSoonList] = useState<any>([])


    useEffect(() => {
        axios.get<any>("https://api.kinoxii.redberryinternship.ge/api/movies/coming-soon")
        .then((res) => {
            setComingSoonList(res.data.data)
        })
    
    }, [])

    return(
        <section className="movie-section">
            <div className="movie-section-title">
                <h3>Coming Soon</h3>
                <a>See all</a>
            </div>
            <ScrollContainer className="movie-section-movielist">
                {
                    comingSoonList.map((data: any) => (
                            <ComingSoonCard key={data.id}
                                cardPhoto={data.posterUrl}
                                cardName={data.title}
                                cardGenre={data.genres[0].name}
                                cardDuration={data.runtimeMinutes}
                                cardPg={data.ageRating.code}
                                cardDate={data.releaseDate}
                            />
                    ))
                }
            </ScrollContainer>

        </section>
    )
}