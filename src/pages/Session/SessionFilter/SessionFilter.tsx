import { useEffect, useState } from "react"
import "./SessionFilter.css"
import axios from "axios"

const times = [
    { id: "morning", name: "Morning", hint: "before 12:00" },
    { id: "afternoon", name: "Afternoon", hint: "12:00–18:00" },
    { id: "evening", name: "Evening", hint: "after 18:00" },
]

export default function SessionFilter(){
    const [filterData, setFilterData] = useState<any>({})

    useEffect(() => {
        axios.get("https://api.kinoxii.redberryinternship.ge/api/filter-options")
        .then((res) => setFilterData(res.data.data))
    }, [])

    return(
        <div className="session-filter-hero">
            <h1>Filters</h1>
            <div className="session-filter-list">
                <div className="session-filter-select">
                    <h2 className="session-filter-options">Venue</h2>
                    {filterData.venues?.map((item: any) => (
                        <div key={item.id}>
                            <input type="checkbox" id={`venue-${item.id}`} />
                            <label htmlFor={`venue-${item.id}`}>{item.name}</label>
                            <span>· {item.city}</span>
                        </div>
                    ))}
                </div>

                <div className="session-filter-date">
                    <h2 className="session-filter-options">Date</h2>
                    {/* date later */}
                </div>

                <div className="session-filter-select">
                    <h2 className="session-filter-options">Format</h2>
                    {filterData.formats?.map((item: any) => (
                        <div key={item.id}>
                            <input type="checkbox" id={`format-${item.id}`} />
                            <label htmlFor={`format-${item.id}`}>{item.name}</label>
                        </div>
                    ))}
                </div>

                <div className="session-filter-select">
                    <h2 className="session-filter-options">Language</h2>
                    {filterData.languages?.map((item: any) => (
                        <div key={item.id}>
                            <input type="checkbox" id={`language-${item.id}`} />
                            <label htmlFor={`language-${item.id}`}>{item.name}</label>
                        </div>
                    ))}
                </div>

                <div className="session-filter-select">
                    <h2 className="session-filter-options">Time of day</h2>
                    {times.map((item) => (
                        <div key={item.id}>
                            <input type="checkbox" id={`time-${item.id}`} />
                            <label htmlFor={`time-${item.id}`}>{item.name}</label>
                            <span>· {item.hint}</span>
                        </div>
                    ))}
                </div>
            </div>

            <p>0 filters active</p>
        </div>
    )
}