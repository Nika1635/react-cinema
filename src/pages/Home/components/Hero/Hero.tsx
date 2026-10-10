import { useState, useEffect } from "react"
import axios from "axios"
import "./Hero.css"
import type { MoviesResponse, Movie } from "../../../../interfaces/movie"
import { useNavigate } from "react-router"

export default function Hero(){
    const [ currentSlide, setCurrentSlide] = useState<number>(0)
    const [ heroInfo, setHeroInfo ] =  useState<Movie[]>([])
    const totalSlides: number = heroInfo?.length
    let navigate = useNavigate()
    
    const next = () => {
        if (currentSlide === totalSlides - 1) {
            setCurrentSlide(0)
        } else {
            setCurrentSlide(currentSlide + 1)
        }
    }

    const prev = () => {
        if (currentSlide === 0) {
            setCurrentSlide(totalSlides - 1)
        } else {
            setCurrentSlide(currentSlide - 1)
        }
    }


    useEffect(() => {
        axios.get<MoviesResponse>("https://api.kinoxii.redberryinternship.ge/api/movies/featured")
        .then((res) => {
            setHeroInfo(res.data.data)
        })
    
    }, [])

    useEffect(() => {
        const timer = setTimeout(next, 5000)
        return () => clearTimeout(timer)
    }, [currentSlide])
    return (
        <section className="hero-section" 
        style={{ backgroundImage: `linear-gradient(270deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.8) 100%), url(${heroInfo[currentSlide]?.backdropUrl})` }}
        >
            <div>
                <p className="hero-premiere">PREMIERE · WEEK OF 15 SEPT</p>

                <div className="hero-film-info">
                    <h1 style={{textTransform: 'uppercase'}}>{heroInfo[currentSlide]?.title}</h1>
                    <div className="hero-film-infolist">
                        <p className="hero-age hero-film-infolist-essential">{heroInfo[currentSlide]?.ageRating.code}</p>
                        <p className="hero-info hero-film-infolist-essential">{heroInfo[currentSlide]?.runtimeMinutes} Min</p>
                        <p className="hero-info hero-film-infolist-essential">{heroInfo[currentSlide]?.formats[currentSlide]?.name}</p>
                        <p className="hero-info hero-film-infolist-essential">{heroInfo[currentSlide]?.genres[currentSlide]?.name}</p>
                    </div>
                    <p className="hero-film-desc">{heroInfo[currentSlide]?.synopsis}</p>
                    <div className="hero-film-buttons">
                        <button onClick={() => navigate(`/movies/${heroInfo[currentSlide]?.slug}`)}>Buy Tickets</button>
                        <button onClick={() => navigate('/session')}>All Session</button>
                    </div>
                </div>
            </div>

            <div className="hero-carousel">
                <div>
                    {heroInfo.map((_, i) => (
                        <div key={i} className="line" onClick={() => setCurrentSlide(i)}>
                            <div
                                key={currentSlide}
                                className={i < currentSlide ? "fill full" : i === currentSlide ? "fill grow" : "fill"}
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <button onClick={prev}>Prev</button>
                    <button onClick={next}>Next</button>
                </div>
            </div>

        </section>
    )
}   