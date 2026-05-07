import IconImage from "../common/IconImage";

export default function PaymentHistoryCard({
  currentPaymentPage,
  filteredDateOptions,
  filteredHistory,
  isDateListOpen,
  onClearDate,
  onCloseDateList,
  onDateInputChange,
  onNextPaymentPage,
  onOpenDateList,
  onPreviousPaymentPage,
  onSelectDate,
  onSelectPaymentPage,
  paginatedHistory,
  paymentsPerPage,
  safePaymentPage,
  selectedDate,
  totalPaymentPages,
}) {
  return (
    <section className="my-membership-page__history-card gm-surface-card">
      <div className="my-membership-page__history-header">
        <div>
          <h2 className="my-membership-page__block-title">PAYMENT HISTORY</h2>
          <p className="my-membership-page__block-subtitle">
            Review your recent payments and invoices
          </p>
        </div>

        <div className="my-membership-page__date-filter">
          <label
            htmlFor="membership-date-filter"
            className="my-membership-page__date-label"
          >
            Select payment date
          </label>

          <div
            className="my-membership-page__date-input-wrapper"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                onCloseDateList();
              }
            }}
          >
            <input
              id="membership-date-filter"
              type="text"
              value={selectedDate}
              onFocus={onOpenDateList}
              onChange={(event) => onDateInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  onCloseDateList();
                }
              }}
              className="my-membership-page__date-input"
              placeholder="Select payment date"
              autoComplete="off"
            />

            {selectedDate && (
              <button
                type="button"
                className="my-membership-page__date-clear"
                onClick={onClearDate}
                aria-label="Clear selected date"
              >
                x
              </button>
            )}

            <IconImage
              name="date"
              decorative
              className="my-membership-page__date-icon"
            />

            {isDateListOpen && (
              <div className="my-membership-page__date-list" role="listbox">
                {filteredDateOptions.length ? (
                  filteredDateOptions.map((payment) => (
                    <button
                      key={payment.id}
                      type="button"
                      className="my-membership-page__date-option"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        onSelectDate(payment.date);
                      }}
                    >
                      <span>{payment.date}</span>
                      <small>{payment.invoice}</small>
                    </button>
                  ))
                ) : (
                  <p className="my-membership-page__date-empty">
                    No payment dates found.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="my-membership-page__table-wrapper">
        <table className="my-membership-page__table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>STATUS</th>
              <th>DESCRIPTION</th>
              <th>AMOUNT</th>
              <th>INVOICE</th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.length ? (
              paginatedHistory.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.date}</td>
                  <td>
                    <span className="my-membership-page__paid-badge">
                      {payment.status}
                    </span>
                  </td>
                  <td>{payment.description}</td>
                  <td>{payment.amount}</td>
                  <td>
                    <button
                      type="button"
                      className="my-membership-page__invoice-btn"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="my-membership-page__empty-state">
                  No payments found for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredHistory.length > paymentsPerPage && (
        <div className="my-membership-page__pagination">
          <button
            type="button"
            className="my-membership-page__pagination-btn"
            onClick={onPreviousPaymentPage}
            disabled={safePaymentPage === 1}
          >
            Previous
          </button>

          <div className="my-membership-page__pagination-pages">
            {Array.from({ length: totalPaymentPages }, (_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  className={`my-membership-page__pagination-page ${
                    pageNumber === currentPaymentPage ? "is-active" : ""
                  }`}
                  onClick={() => onSelectPaymentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="my-membership-page__pagination-btn"
            onClick={onNextPaymentPage}
            disabled={safePaymentPage === totalPaymentPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
