import "./Pagination.css"

type Props = {
    currentPage: number
    lastPage: number
    onPageChange: (page: number) => void
    disabled?: boolean
}

const getPages = (current: number, last: number): (number | "...")[] => {
    if (last <= 5) return Array.from({ length: last }, (_, i) => i + 1)
    if (current <= 3) return [1, 2, 3, "...", last]
    if (current >= last - 2) return [1, "...", last - 2, last - 1, last]
    return [1, "...", current - 1, current, current + 1, "...", last]
}

export default function Pagination({ currentPage, lastPage, onPageChange, disabled = false }: Props) {
    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                type="button"
                className="pagination-item pagination-arrow"
                disabled={disabled || currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            {getPages(currentPage, lastPage).map((p, i) =>
                p === "..." ? (
                    <span key={`dots-${i}`} className="pagination-item pagination-dots">...</span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        className={`pagination-item pagination-page ${p === currentPage ? "active" : ""}`}
                        disabled={disabled}
                        onClick={() => onPageChange(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                type="button"
                className="pagination-item pagination-arrow"
                disabled={disabled || currentPage >= lastPage}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </nav>
    )
}