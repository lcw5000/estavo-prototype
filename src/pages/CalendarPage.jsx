// Estavo Prototype — CalendarPage
import { useNavigate } from 'react-router-dom'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_START_DOW = 2 // April 1, 2026 = Wednesday (0=Sun)
const DAYS_IN_MONTH = 30
const TODAY = 23

const EVENTS = {
  23: [{ label: '🔴 Offer deadline — 147 Oak St', type: 'deadline', txId: 'txn-2' }],
  26: [{ label: '🏠 Showing — Priya · 22 Clipper · 2pm', type: 'showing' }],
  27: [{ label: '🏠 Showing — Thomas · 88 Sanchez · 11am', type: 'showing' }],
  28: [{ label: '📋 Inspection — 14 Oak St · 10am', type: 'inspection', txId: 'txn-1' }],
  30: [{ label: '⚠️ Inspection contingency — 14 Oak St', type: 'deadline', txId: 'txn-1' }],
}

const MAY_EVENTS = {
  5: [{ label: '📋 Appraisal — 14 Oak St', type: 'inspection', txId: 'txn-1' }],
}

function eventCls(type) {
  if (type === 'deadline')   return 'bg-[#FDF0EE] text-rust'
  if (type === 'showing')    return 'bg-[#EEF2FC] text-[#2B4FA0]'
  if (type === 'inspection') return 'bg-[#FEF8EC] text-[#9A6A10]'
  if (type === 'closing')    return 'bg-[#EEF6F2] text-teal'
  return 'bg-[#F5F5F5] text-[#8A8A8A]'
}

const UPCOMING = [
  { date: 'Apr 23', label: '🔴 Offer response deadline — 147 Oak St', type: 'deadline', txId: 'txn-2' },
  { date: 'Apr 26', label: '🏠 Showing — Priya Sharma · 22 Clipper St · 2:00pm', type: 'showing' },
  { date: 'Apr 27', label: '🏠 Showing — Thomas Reed · 88 Sanchez St · 11:00am', type: 'showing' },
  { date: 'Apr 28', label: '📋 Home inspection — 14 Oak St · 10:00am', type: 'inspection', txId: 'txn-1' },
  { date: 'Apr 30', label: '⚠️ Inspection contingency removal — 14 Oak St', type: 'deadline', txId: 'txn-1' },
]

export default function CalendarPage() {
  const navigate = useNavigate()

  function handleEvent(ev) {
    if (ev.txId) navigate(`/transactions/${ev.txId}`)
    else navigate('/showings')
  }

  // Build grid cells: leading blanks + days
  const cells = [
    ...Array(MONTH_START_DOW).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ]
  // Pad to complete rows
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="space-y-4">
      {/* Month header */}
      <div className="bg-white rounded-xl border border-rule overflow-hidden">
        <div className="px-4 py-3 border-b border-rule">
          <p className="text-[13px] font-semibold text-navy">April 2026</p>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-rule">
          {DAYS.map(d => (
            <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-ink3">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const isToday = day === TODAY
            const events = day ? (EVENTS[day] ?? []) : []
            const isLast = i >= cells.length - 7

            return (
              <div
                key={i}
                className={`min-h-[90px] p-1.5 border-b border-r border-[#F5F5F5] ${
                  i % 7 === 6 ? 'border-r-0' : ''
                } ${isLast ? 'border-b-0' : ''} ${!day ? 'bg-[#FAFAFA]' : ''}`}
              >
                {day && (
                  <>
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-medium mb-1 ${
                      isToday ? 'bg-rust text-white' : 'text-navy'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {events.map((ev, j) => (
                        <button
                          key={j}
                          onClick={() => handleEvent(ev)}
                          className={`w-full text-left text-[9px] leading-tight px-1.5 py-0.5 rounded truncate ${eventCls(ev.type)}`}
                        >
                          {ev.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming this week */}
      <div className="bg-white rounded-xl border border-rule p-4">
        <p className="text-[12px] font-semibold text-navy mb-3">Upcoming this week</p>
        <div className="space-y-2">
          {UPCOMING.map((item, i) => (
            <div
              key={i}
              onClick={() => handleEvent(item)}
              className="flex items-center gap-3 py-2 border-b border-[#F5F5F5] last:border-0 cursor-pointer hover:bg-ui-bg -mx-1 px-1 rounded transition-colors"
            >
              <span className="text-[10px] text-ink3 w-12 shrink-0">{item.date}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full flex-1 truncate ${eventCls(item.type)}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
