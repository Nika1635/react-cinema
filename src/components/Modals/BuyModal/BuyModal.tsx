import "./BuyModal.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { useAuth } from "../../../services/AuthContext.tsx"

const BASE_URL = "https://api.kinoxii.redberryinternship.ge/api"
const MAX_SEATS = 3
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(\+995|995)?\s?5\d{2}\s?\d{3}\s?\d{3}$/

const ticketTypes = [
    { id: "child", name: "Child", ratio: 0.6 },
    { id: "student", name: "Student", ratio: 0.75 },
    { id: "adult", name: "Adult", ratio: 1 },
]

const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

const fmtTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`

const getAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth)
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    const hadBirthday =
        now.getMonth() > birth.getMonth() ||
        (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())
    if (!hadBirthday) age--
    return age
}

const isExpiryValid = (value: string) => {
    const match = /^(\d{2})\/(\d{2})$/.exec(value)
    if (!match) return false
    const month = Number(match[1])
    const year = 2000 + Number(match[2])
    if (month < 1 || month > 12) return false
    return new Date(year, month, 1).getTime() > Date.now()
}

const validate = (f: any) => ({
    fullName: f.fullName.trim().length >= 3 ? "" : "Minimum 3 characters",
    email: EMAIL_REGEX.test(f.email) ? "" : "Enter a valid email",
    mobileNumber: PHONE_REGEX.test(f.mobileNumber.trim()) ? "" : "Enter a valid Georgian number",
    cardNumber: f.cardNumber.replace(/\s/g, "").length === 16 ? "" : "Card number must be 16 digits",
    expiry: isExpiryValid(f.expiry) ? "" : "Enter a future date (MM/YY)",
    cvv: /^\d{3}$/.test(f.cvv) ? "" : "CVV must be 3 digits",
})

const readLostCodes = (data: any): string[] => {
    const list = data?.seats ?? data?.unavailableSeats ?? data?.data?.seats ?? []
    return list.map((item: any) => (typeof item === "string" ? item : item.code))
}

const CheckIcon = () => (
    <svg className="seats-modal-check" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
)

type BuyModalProps = {
    session: any
    movie: any
    onClose: () => void
}

export default function BuyModal({ session, movie, onClose }: BuyModalProps) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState<"seats" | "checkout" | "confirmed">("seats")
    const [sections, setSections] = useState<any[]>([])
    const [selected, setSelected] = useState<any[]>([])
    const [soldCodes, setSoldCodes] = useState<string[]>([])
    const [notice, setNotice] = useState<string>("")
    const [holding, setHolding] = useState<boolean>(false)
    const [holdId, setHoldId] = useState<string>("")
    const [serverSubtotal, setServerSubtotal] = useState<number | null>(null)
    const [expiresAt, setExpiresAt] = useState<number | null>(null)
    const [secondsLeft, setSecondsLeft] = useState<number>(0)

    const [form, setForm] = useState({
        fullName: user.fullName ?? user.username ?? "",
        email: user.email ?? "",
        mobileNumber: user.mobileNumber ?? "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    })
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
    const [checkoutError, setCheckoutError] = useState<string>("")
    const [paying, setPaying] = useState<boolean>(false)
    const [order, setOrder] = useState<any>(null)

    const loadSeats = () => {
        axios.get(`${BASE_URL}/sessions/${session.id}/seats`, authConfig())
            .then((res) => setSections(res.data.data.sections))
    }

    useEffect(() => {
        loadSeats()
    }, [])

    useEffect(() => {
        if (!expiresAt) return

        const tick = () => {
            const left = Math.max(0, Math.round((expiresAt - Date.now()) / 1000))
            setSecondsLeft(left)
            if (left === 0) {
                setExpiresAt(null)
                setHoldId("")
                setServerSubtotal(null)
                setSelected([])
                setSoldCodes([])
                setStep("seats")
                setNotice("Your hold time expired. Please re-select your seats.")
                loadSeats()
            }
        }

        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [expiresAt])

    const releaseHold = () => {
        if (holdId) axios.delete(`${BASE_URL}/holds/${holdId}`, authConfig()).catch(() => {})
        setHoldId("")
        setServerSubtotal(null)
        setExpiresAt(null)
    }

    const handleClose = () => {
        if (step === "checkout") releaseHold()
        onClose()
    }

    const backToSeats = () => {
        releaseHold()
        setStep("seats")
        loadSeats()
    }

    const getStatus = (seat: any) => {
        if (soldCodes.includes(seat.code)) return "sold"
        if (selected.some((s) => s.id === seat.id)) return "selected"
        if (seat.state === "held" && seat.isMine) return "available"
        return seat.state
    }

    const toggleSeat = (seat: any) => {
        const status = getStatus(seat)
        if (status === "selected") {
            setSelected((prev) => prev.filter((s) => s.id !== seat.id))
            setNotice("")
            return
        }
        if (status !== "available") return
        if (selected.length >= MAX_SEATS) {
            setNotice(`You can select a maximum of ${MAX_SEATS} seats per order.`)
            return
        }
        setSelected((prev) => [...prev, { id: seat.id, code: seat.code, typeId: "adult" }])
        setNotice("")
    }

    const setSeatType = (seatId: number, typeId: string) => {
        setSelected((prev) => prev.map((s) => (s.id === seatId ? { ...s, typeId } : s)))
    }

    const removeSeat = (seatId: number) => {
        setSelected((prev) => prev.filter((s) => s.id !== seatId))
        setNotice("")
    }

    const ratioOf = (typeId: string) => ticketTypes.find((t) => t.id === typeId)?.ratio ?? 1
    const seatPrice = (seat: any) => session.price * ratioOf(seat.typeId)
    const subtotal = selected.reduce((sum, seat) => sum + seatPrice(seat), 0)
    const total = serverSubtotal !== null ? serverSubtotal : subtotal

    const minAge = movie.ageRating.minAge
    const ruleErrors = selected
        .filter((s) => s.typeId === "child" && minAge >= 16)
        .map((s) => `Seat ${s.code}: Child tickets are not available for ${movie.ageRating.code} films.`)

    let accountError = ""
    if (!user.mobileNumber || !user.dateOfBirth) {
        accountError = "Complete your profile to book tickets."
    } else if (getAge(user.dateOfBirth) < minAge) {
        accountError = `This film is rated ${movie.ageRating.code}. You cannot buy tickets for it with this account.`
    }

    const canContinue =
        selected.length > 0 && ruleErrors.length === 0 && !accountError && !holding

    const handleHold = () => {
        if (!canContinue) return
        setHolding(true)
        setNotice("")

        axios.post(
            `${BASE_URL}/sessions/${session.id}/holds`,
            { seats: selected.map((s) => ({ seatId: s.id, ticketType: s.typeId })) },
            authConfig()
        )
            .then((res) => {
                const hold = res.data.data
                setHoldId(hold.holdId)
                setServerSubtotal(hold.subtotal)
                setExpiresAt(new Date(hold.expiresAt).getTime())
                setStep("checkout")
            })
            .catch((err) => {
                if (err.response?.status === 409) {
                    const lost = readLostCodes(err.response.data)
                    setSoldCodes((prev) => [...prev, ...lost])
                    setSelected((prev) => prev.filter((s) => !lost.includes(s.code)))
                    setNotice(
                        lost.length > 0
                            ? `Seats ${lost.join(", ")} were just taken by someone else.`
                            : "Some of your seats were just taken by someone else."
                    )
                    loadSeats()
                } else {
                    setNotice(err.response?.data?.message ?? "Could not hold your seats. Try again.")
                }
            })
            .finally(() => setHolding(false))
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target
        let value = e.target.value

        if (name === "cardNumber") {
            value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
        }
        if (name === "expiry") {
            const digits = value.replace(/\D/g, "").slice(0, 4)
            value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
        }
        if (name === "cvv") {
            value = value.replace(/\D/g, "").slice(0, 3)
        }

        setForm((prev) => ({ ...prev, [name]: value }))
        setServerErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }))
    }

    const errors: Record<string, string> = validate(form)
    const formInvalid = Object.values(errors).some(Boolean)

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault()
        if (paying || formInvalid) return
        setPaying(true)
        setCheckoutError("")
        setServerErrors({})

        axios.post(
            `${BASE_URL}/orders`,
            {
                holdId,
                fullName: form.fullName,
                email: form.email,
                mobileNumber: form.mobileNumber.replace(/\s/g, ""),
                cardNumber: form.cardNumber,
                expiry: form.expiry,
                cvv: form.cvv,
            },
            authConfig()
        )
            .then((res) => {
                setOrder(res.data.data)
                setExpiresAt(null)
                setStep("confirmed")
            })
            .catch((err) => {
                const status = err.response?.status
                if (status === 422) {
                    const raw = err.response.data?.errors ?? {}
                    const flat: Record<string, string> = {}
                    Object.entries(raw).forEach(([key, value]: [string, any]) => {
                        flat[key] = Array.isArray(value) ? value[0] : value
                    })
                    setServerErrors(flat)
                    setTouched({
                        fullName: true, email: true, mobileNumber: true,
                        cardNumber: true, expiry: true, cvv: true,
                    })
                } else {
                    setCheckoutError(err.response?.data?.message ?? "Payment failed. Try again.")
                }
            })
            .finally(() => setPaying(false))
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !paying) handleClose()
    }

    const dateText = new Date(session.date).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
    })
    const shortDate = new Date(session.date).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
    })
    const infoLine = `${session.venue.name} · Hall ${session.hall.name} · ${dateText} · ${session.time} · ${session.format.name} · ${session.language.name}`
    const seatCodes = selected.map((s) => s.code).join(", ")
    const ticketsText = [...ticketTypes]
        .reverse()
        .map((t) => ({ name: t.name, count: selected.filter((s) => s.typeId === t.id).length }))
        .filter((t) => t.count > 0)
        .map((t) => `${t.count} x ${t.name}`)
        .join(", ")

    const renderField = (name: string, label: string, placeholder: string) => {
        const error = (touched[name] && errors[name]) || serverErrors[name]
        const valid = !errors[name] && form[name as keyof typeof form] && !serverErrors[name]

        return (
            <div className={`seats-modal-field ${error ? "seats-modal-field-error" : ""}`}>
                <label htmlFor={name}>{label}</label>
                <div className="seats-modal-inputwrap">
                    <input
                        id={name}
                        name={name}
                        type="text"
                        placeholder={placeholder}
                        value={form[name as keyof typeof form]}
                        onChange={handleFormChange}
                        onBlur={handleBlur}
                    />
                    {valid && <CheckIcon />}
                </div>
                {error && <p>{error}</p>}
            </div>
        )
    }

    if (step === "confirmed") {
        const reference = order?.reference ?? order?.orderCode ?? order?.code ?? order?.id
        return (
            <div className="modal-hero" onClick={handleOverlayClick}>
                <div className="seats-modal-hero seats-modal-confirmed">
                    <div className="seats-modal-success">
                        <CheckIcon />
                    </div>
                    <h2>Booking confirmed!</h2>
                    <p>Your tickets are ready. We've sent the confirmation to your email.</p>
                    {reference && <span className="seats-modal-order">ORDER #{reference}</span>}

                    <div className="seats-modal-receipt">
                        <div className="seats-modal-receipt-top">
                            <img src={movie.posterUrl} alt={movie.title} />
                            <div>
                                <h3>{movie.title}</h3>
                                <p>{session.venue.name} · Hall {session.hall.name} · {shortDate} · {session.time}</p>
                            </div>
                        </div>
                        <div className="seats-modal-receipt-row">
                            <span>Seats</span>
                            <strong>{seatCodes}</strong>
                        </div>
                        <div className="seats-modal-receipt-row">
                            <span>Tickets</span>
                            <strong>{ticketsText}</strong>
                        </div>
                        <div className="seats-modal-receipt-total">
                            <span>Total paid</span>
                            <strong>₾ {fmt(total)}</strong>
                        </div>
                    </div>

                    <div className="seats-modal-actions">
                        <button className="seats-modal-primary" onClick={() => { onClose(); navigate("/profile") }}>
                            My Tickets
                        </button>
                        <button className="seats-modal-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="modal-hero" onClick={handleOverlayClick}>
            <div className="seats-modal-hero">
                <div className="seats-modal-header">
                    <div>
                        <h1>{movie.title}</h1>
                        <p>{infoLine}</p>
                    </div>
                    <div className="seats-modal-header-right">
                        {expiresAt && (
                            <div className="seats-modal-timer">
                                <span>Seats held</span>
                                <strong>{fmtTime(secondsLeft)}</strong>
                            </div>
                        )}
                        <button className="seats-modal-close" type="button" aria-label="Close" onClick={handleClose} disabled={paying}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="seats-modal-body">
                    <div className="seats-modal-main">
                        <div className="seats-modal-steps">
                            <span
                                className={step === "seats" ? "seats-modal-step-active" : ""}
                                onClick={step === "checkout" && !paying ? backToSeats : undefined}
                            >
                                Seats
                            </span>
                            <span className={step === "checkout" ? "seats-modal-step-active" : ""}>Checkout</span>
                        </div>

                        {step === "seats" && (
                            <>
                                <div className="seats-modal-screen">Screen</div>

                                <div className="seats-modal-map">
                                    {sections.map((section, sectionIndex) => (
                                        <div className="seats-modal-section" key={`${section.name}-${sectionIndex}`}>
                                            {section.rows.map((row: any) => (
                                                <div className="seats-modal-row" key={`${sectionIndex}-${row.label}`}>
                                                    <span className="seats-modal-row-label">{row.label}</span>
                                                    <div className="seats-modal-row-seats">
                                                        {row.seats.map((seat: any) => {
                                                            const status = getStatus(seat)
                                                            const clickable = status === "available" || status === "selected"
                                                            return (
                                                                <button
                                                                    key={`${sectionIndex}-${row.label}-${seat.id}`}
                                                                    type="button"
                                                                    className={`seats-modal-seat seats-modal-seat-${status} ${seat.aisleAfter ? "seats-modal-seat-aisle" : ""}`}
                                                                    disabled={!clickable}
                                                                    onClick={() => toggleSeat(seat)}
                                                                >
                                                                    {seat.label}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <div className="seats-modal-legend">
                                    <span><i className="seats-modal-seat-available"></i>Available</span>
                                    <span><i className="seats-modal-seat-selected"></i>Selected</span>
                                    <span><i className="seats-modal-seat-sold"></i>Sold</span>
                                    <span><i className="seats-modal-seat-held"></i>Held by another user</span>
                                    <span><i className="seats-modal-seat-unavailable"></i>Unavailable</span>
                                </div>
                            </>
                        )}

                        {step === "checkout" && (
                            <form id="seats-checkout-form" className="seats-modal-form" onSubmit={handlePay} noValidate>
                                {renderField("fullName", "Full name", "e.g. Meri Sanikidze")}
                                <div className="seats-modal-grid">
                                    {renderField("email", "Email", "e.g. example@gmail.com")}
                                    {renderField("mobileNumber", "Mobile number", "e.g. 555 123 456")}
                                </div>
                                <div className="seats-modal-divider"></div>
                                {renderField("cardNumber", "Card number", "e.g. 1234 4567 8901 2345")}
                                <div className="seats-modal-grid">
                                    {renderField("expiry", "Expiry", "e.g. 12/34")}
                                    {renderField("cvv", "CVV", "e.g. 123")}
                                </div>
                                {checkoutError && <p className="seats-modal-message">{checkoutError}</p>}
                            </form>
                        )}
                    </div>

                    <aside className="seats-modal-side">
                        {step === "seats" && (
                            <>
                                <h3 className="seats-modal-side-title">Your seats · Max {MAX_SEATS}</h3>

                                <div className="seats-modal-list">
                                    {selected.length === 0 && (
                                        <p className="seats-modal-hint">Select a seat on the map.</p>
                                    )}
                                    {selected.map((seat) => (
                                        <div className="seats-modal-card" key={seat.id}>
                                            <div className="seats-modal-card-top">
                                                <span>Seat</span>
                                                <strong>{seat.code}</strong>
                                                <b>₾{fmt(seatPrice(seat))}</b>
                                                <button type="button" aria-label="Remove seat" onClick={() => removeSeat(seat.id)}>×</button>
                                            </div>
                                            <div className="seats-modal-types">
                                                {ticketTypes.map((t) => (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        className={seat.typeId === t.id ? "seats-modal-type-active" : ""}
                                                        onClick={() => setSeatType(seat.id, t.id)}
                                                    >
                                                        {t.name} {Math.round(t.ratio * 100)}%
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {notice && <p className="seats-modal-message">{notice}</p>}
                                {ruleErrors.map((message) => (
                                    <p className="seats-modal-message" key={message}>{message}</p>
                                ))}
                                {accountError && <p className="seats-modal-message">{accountError}</p>}

                                <div className="seats-modal-total">
                                    <span>Subtotal</span>
                                    <strong>₾ {fmt(subtotal)}</strong>
                                </div>
                                <button className="seats-modal-primary" disabled={!canContinue} onClick={handleHold}>
                                    {holding ? "Holding..." : "Next: Checkout"}
                                </button>
                            </>
                        )}

                        {step === "checkout" && (
                            <>
                                <h3 className="seats-modal-side-title">Summary</h3>

                                <div className="seats-modal-summary">
                                    <h4>{movie.title}</h4>
                                    <p>Hall {session.hall.name} · {shortDate} · {session.time}</p>
                                    <div className="seats-modal-summary-row">
                                        <span>Seats</span>
                                        <strong>{seatCodes}</strong>
                                    </div>
                                    <div className="seats-modal-summary-row">
                                        <span>Tickets</span>
                                        <strong>{ticketsText}</strong>
                                    </div>
                                </div>

                                <div className="seats-modal-spacer"></div>

                                <div className="seats-modal-total">
                                    <span>Subtotal</span>
                                    <strong>₾ {fmt(total)}</strong>
                                </div>
                                <button
                                    className="seats-modal-primary"
                                    type="submit"
                                    form="seats-checkout-form"
                                    disabled={paying || formInvalid}
                                >
                                    {paying ? "Processing..." : "Pay & Complete Order"}
                                </button>
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    )
}