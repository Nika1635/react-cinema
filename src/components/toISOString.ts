const toISO = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}

export const getNextDays = (count = 7) =>
    Array.from({ length: count }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() + i)
        return {
            value: toISO(d),
            weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
            day: d.getDate(),
        }
    })