import { useEffect, useState } from "react"
import "./SessionFilter.css"
import axios from "axios"

export type Filters = {
    date: string
    venues: string[]
    formats: string[]
    languages: string[]
    bands: string[]
}

export const emptyFilters: Filters = {
    date: "",
    venues: [],
    formats: [],
    languages: [],
    bands: [],
}

type ArrayFilterKey = "venues" | "formats" | "languages" | "bands"

type Option = { id: number; slug: string; name: string; city?: string }

type FilterOptions = {
    venues?: Option[]
    formats?: Option[]
    languages?: Option[]
}

type SessionFilterProps = {
    filters: Filters
    onChange: (filters: Filters) => void
    onClear: () => void
}

const times = [
    { id: "morning", name: "Morning", hint: "before 12:00" },
    { id: "afternoon", name: "Afternoon", hint: "12:00–18:00" },
    { id: "evening", name: "Evening", hint: "after 18:00" },
]

export default function SessionFilter({ filters, onChange, onClear }: SessionFilterProps) {
    const [options, setOptions] = useState<FilterOptions>({})

    useEffect(() => {
        axios
            .get("https://api.kinoxii.redberryinternship.ge/api/filter-options")
            .then((res) => setOptions(res.data.data))
            .catch((err) => console.error(err))
    }, [])

    const toggle = (key: ArrayFilterKey, value: number | string) => {
        const current = filters[key] as (number | string)[]
        const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value]
        onChange({ ...filters, [key]: next })
    }

    const renderGroup = (
        title: string,
        key: Exclude<ArrayFilterKey, "bands">,
        items: Option[] = [],
        prefix: string,
    ) => (
        <div className="session-filter-select">
            <h2 className="session-filter-options">{title}</h2>
            {items.map((item) => (
                <div key={item.id}>
                    <input
                        type="checkbox"
                        id={`${prefix}-${item.slug}`}
                        checked={filters[key].includes(item.slug)}
                        onChange={() => toggle(key, item.slug)}
                    />
                    <label htmlFor={`${prefix}-${item.slug}`}>{item.name}</label>
                    {item.city && <span>· {item.city}</span>}
                </div>
            ))}
        </div>
    )

    const activeCount =
        (filters.date ? 1 : 0) +
        filters.venues.length +
        filters.formats.length +
        filters.languages.length +
        filters.bands.length

    return (
        <div className="session-filter-hero">
            <h1>Filters</h1>

            <div className="session-filter-list">
                {renderGroup("Venue", "venues", options.venues, "venue")}

                <div className="session-filter-date">
                    <h2 className="session-filter-options">Date</h2>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => onChange({ ...filters, date: e.target.value })}
                    />
                </div>

                {renderGroup("Format", "formats", options.formats, "format")}
                {renderGroup("Language", "languages", options.languages, "language")}

                <div className="session-filter-select">
                    <h2 className="session-filter-options">Time of day</h2>
                    {times.map((item) => (
                        <div key={item.id}>
                            <input
                                type="checkbox"
                                id={`time-${item.id}`}
                                checked={filters.bands.includes(item.id)}
                                onChange={() => toggle("bands", item.id)}
                            />
                            <label htmlFor={`time-${item.id}`}>{item.name}</label>
                            <span>· {item.hint}</span>
                        </div>
                    ))}
                </div>
            </div>

            <p>{activeCount} filters active</p>
            {activeCount > 0 && (
                <button type="button" onClick={onClear}>
                    Clear all
                </button>
            )}
        </div>
    )
}