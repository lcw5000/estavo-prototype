// Estavo Prototype — DeadlineTracker
import { useState } from 'react'

function urgencyColor(urgency) {
  if (urgency === 'red')   return '#C84B2F'
  if (urgency === 'amber') return '#C49A3C'
  return '#1A5C4A'
}

function daysBadge(days, urgency) {
  if (urgency === 'red')   return { cls: 'bg-[#FDF0EE] text-rust',        label: days === 0 ? 'Today' : `${days} days` }
  if (urgency === 'amber') return { cls: 'bg-[#FEF8EC] text-[#9A6A10]',  label: `${days} days` }
  return                          { cls: 'bg-[#EEF6F2] text-teal',        label: `${days} days` }
}

function fmtDate(str) {
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function DeadlineRow({ dl, onToast }) {
  const [extending, setExtending] = useState(false)
  const [newDate, setNewDate] = useState(dl.date)
  const [confirmedDate, setConfirmedDate] = useState(null)
  const { cls, label } = daysBadge(dl.daysRemaining, dl.urgency)
  const displayDate = confirmedDate ?? dl.date

  function confirmExtend() {
    setConfirmedDate(newDate)
    setExtending(false)
    onToast('Deadline extended — addendum drafted for review')
  }

  return (
    <div className="border-b border-[#F5F5F5] last:border-0">
      <div className="flex items-center gap-3 py-2.5">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: urgencyColor(dl.urgency) }} />
        <p className="text-[12px] font-medium text-navy flex-1">{dl.name}</p>
        <p className="text-[11px] text-[#8A8A8A]">{fmtDate(displayDate)}</p>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
        <button
          onClick={() => setExtending(o => !o)}
          className="text-[11px] text-slate border border-rule rounded px-2 py-0.5 hover:bg-ui-bg transition-colors shrink-0"
        >
          Extend
        </button>
      </div>
      {extending && (
        <div className="pb-3 pl-5 flex items-center gap-2">
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="text-[11px] border border-rule rounded px-2 py-1 text-navy outline-none focus:ring-1 focus:ring-rust/30"
          />
          <button
            onClick={confirmExtend}
            className="text-[11px] bg-rust text-white rounded px-3 py-1 hover:bg-[#B33D24] transition-colors"
          >
            Confirm extension
          </button>
          <button onClick={() => setExtending(false)} className="text-[11px] text-ink3 hover:text-navy">Cancel</button>
        </div>
      )}
    </div>
  )
}

export default function DeadlineTracker({ deadlines, onToast }) {
  const sorted = [...deadlines].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <p className="text-[11px] text-ink3 font-medium">Legend:</p>
        {[['#1A5C4A', '>7 days'], ['#C49A3C', '3–7 days'], ['#C84B2F', '<3 days']].map(([color, lbl]) => (
          <div key={lbl} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-ink3">{lbl}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-rule px-4">
        {sorted.map(dl => <DeadlineRow key={dl.id} dl={dl} onToast={onToast} />)}
      </div>
    </div>
  )
}
