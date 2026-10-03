import "./Home.css"
import Hero from "./components/Hero/Hero.tsx"
import NowPlayingSection from "./components/NowPlayingSection/NowPlayingSection.tsx"

export default function Home(){
    return(
        <div className="home">
            <Hero/>
            <div className="home-movies">
                <NowPlayingSection/>
            </div>
        </div>
    )
}