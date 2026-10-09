import "./Profile.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../services/AuthContext.tsx"
import { updateProfile } from "../../services/authApi.ts"

export default function ProfilePage(){
    const { user, refreshUser } = useAuth()
    const [tab, setTab] = useState<"info" | "tickets">("info")
    const [venues, setVenues] = useState<any[]>([])
    const [saving, setSaving] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNumber: "",
        dateOfBirth: "",
        preferredVenueId: "",
    })

    useEffect(() => {
        axios.get("https://api.kinoxii.redberryinternship.ge/api/filter-options")
        .then((res) => setVenues(res.data.data.venues))
    }, [])

    useEffect(() => {
        if (!user) return
        console.log(user)
        setFormData({
            fullName: user.fullName ?? user.username ?? "",
            mobileNumber: user.mobileNumber ?? "",
            dateOfBirth: user.dateOfBirth ?? "",
            preferredVenueId: user.preferredVenueId ? String(user.preferredVenueId) : "",
        })
    }, [user])

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage("")

        updateProfile(formData)
            .then(() => refreshUser())
            .then(() => setMessage("Saved"))
            .catch((err: any) => {
                console.log(err.response?.data)
                setMessage("Could not save changes")
            })
            .finally(() => setSaving(false))
    }

    if (!user) return null

    return(
        <div className="profile-page-hero">
            <div className="profile-page-header">
                <h1>My Profile</h1>

                <div className="profile-page-tabs">
                    <button
                        className={`profile-page-tab ${tab === "info" ? "profile-page-tab-active" : ""}`}
                        onClick={() => setTab("info")}
                    >
                        Personal Information
                    </button>
                    <button
                        className={`profile-page-tab ${tab === "tickets" ? "profile-page-tab-active" : ""}`}
                        onClick={() => setTab("tickets")}
                    >
                        My Tickets
                        <span className="profile-page-badge">2</span>
                    </button>
                </div>
            </div>

            {tab === "info" && (
                <form className="profile-page-form" onSubmit={handleSubmit}>
                    <div className="profile-page-field">
                        <label htmlFor="fullName">Full name</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="profile-page-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={user.email ?? ""}
                            disabled
                        />
                        <p>Set at registration and cannot be changed</p>
                    </div>

                    <div className="profile-page-field">
                        <label htmlFor="mobileNumber">Mobile number</label>
                        <input
                            id="mobileNumber"
                            name="mobileNumber"
                            type="tel"
                            placeholder="e.g. 555 123 456"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="profile-page-field">
                        <label htmlFor="dateOfBirth">Date of birth</label>
                        <input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="profile-page-field">
                        <label htmlFor="preferredVenueId">Preferred Venue (Optional)</label>
                        <select
                            id="preferredVenueId"
                            name="preferredVenueId"
                            value={formData.preferredVenueId}
                            onChange={handleChange}
                        >
                            <option value="">e.g. Galleria Tbilisi</option>
                            {venues.map((v) => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="profile-page-actions">
                        <button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save changes"}
                        </button>
                        {message && <p>{message}</p>}
                    </div>
                </form>
            )}

            {tab === "tickets" && (
                <div className="profile-page-tickets">
                    {/* tickets list later */}
                </div>
            )}
        </div>
    )
}