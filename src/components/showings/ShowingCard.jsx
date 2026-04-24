// Estavo Prototype — ShowingCard

const STATUS = {
  confirmed: { label: 'Confirmed', cls: 'bg-[#E6F4EE] text-teal' },
  pending:   { label: 'Pending',   cls: 'bg-[#FEF3E2] text-[#9A6A10]' },
  completed: { label: 'Completed', cls: 'bg-[#F5F5F5] text-ink3' },
}

function fmt(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

export default function ShowingCard({ showing, onConfirm }) {
  const badge = STATUS[showing.status] ?? STATUS.completed
  const isUpcoming = showing.status !== 'completed'
  const price = showing.propertyPrice
    ? `$${(showing.propertyPrice / 1000).toFixed(0)}K`
    : null

  return (
    <div className="bg-white border border-rule rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-navy leading-tight">{showing.address}</p>
          {price && <p className="text-[11px] text-ink3 mt-0.5">{price}</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] font-medium text-navy">{fmt(showing.date)}</p>
          <p className="text-[10px] text-ink3">{showing.time}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold shrink-0"
            style={{ backgroundColor: showing.contactAvatarColor }}
          >
            {showing.contactAvatar}
          </div>
          <span className="text-[11px] text-navy">{showing.contactName}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-semibold px-2 py-1 rounded-md ${badge.cls}`}>
            {badge.label}
          </span>
          {isUpcoming && showing.status === 'pending' && (
            <button onClick={onConfirm}
              className="text-[9px] font-semibold px-2 py-1 bg-teal text-white rounded-md hover:opacity-80 transition-opacity">
              Confirm
            </button>
          )}
          {isUpcoming && (
            <button className="text-[9px] px-2 py-1 border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors">
              Reschedule
            </button>
          )}
        </div>
      </div>

      {showing.feedback && (
        <div className="mt-3">
          <div className="bg-[#F5F5F5] rounded-lg p-2">
            <p className="text-[11px] italic text-slate">"{showing.feedback}"</p>
          </div>
          <div className="mt-1.5">
            {showing.aiFlag === 'clear' ? (
              <span className="text-[9px] font-semibold bg-[#E6F4EE] text-teal px-2 py-0.5 rounded">
                ✦ AI: No concerns flagged
              </span>
            ) : (
              <span className="text-[9px] font-semibold bg-[#FEF3E2] text-[#9A6A10] px-2 py-0.5 rounded">
                ✦ AI: Concern flagged — review
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
