import { useState, useEffect } from "react"
import axios from "axios"
import "./Hero.css"
import type { MoviesResponse, Movie } from "../../../../interfaces/movie"

export default function Hero(){

    const [ heroInfo, setHeroInfo ] =  useState<Movie[]>([])

    useEffect(() => {
        axios.get<MoviesResponse>("https://api.kinoxii.redberryinternship.ge/api/movies/featured")
        .then((res) => {
            setHeroInfo(res.data.data)
        })
    
    }, [])

    return (
        <section className="hero-section" 
        style={{ backgroundImage: `linear-gradient(270deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.8) 100%), url(${heroInfo[0]?.backdropUrl})` }}
        >
                
            {/* <button onClick={() => console.log(heroInfo[0])}>click</button> */}
            <div>
                <p className="hero-premiere">PREMIERE · WEEK OF 15 SEPT</p>

                <div className="hero-film-info">
                    <h1 style={{textTransform: 'uppercase'}}>{heroInfo[0]?.title}</h1>
                    <div className="hero-film-infolist">
                        <p className="hero-age hero-film-infolist-essential">{heroInfo[0]?.ageRating.code}</p>
                        <p className="hero-info hero-film-infolist-essential">{heroInfo[0]?.runtimeMinutes} Min</p>
                        <p className="hero-info hero-film-infolist-essential">{heroInfo[0]?.formats[0].name}</p>
                        <p className="hero-info hero-film-infolist-essential">{heroInfo[0]?.genres[0].name}</p>
                    </div>
                    <p className="hero-film-desc">{heroInfo[0]?.synopsis}</p>
                    <div className="hero-film-buttons">
                        <button></button>
                        <button></button>
                    </div>
                </div>
            </div>

            <div>
                <div></div>
                <div></div>
            </div>

        </section>
    )
}   