// Estavo Prototype — LeadRow
import { contactTriggers } from '../../data/mockData'

function scoreColors(score) {
  if (score == null)  return { bg: '#EEF2FC', text: '#2B4FA0' }
  if (score >= 80)    return { bg: '#FDF0EE', text: '#C84B2F' }
  if (score >= 60)    return { bg: '#FEF8EC', text: '#9A6A10' }
  if (score >= 40)    return { bg: '#EEF2FC', text: '#2B4FA0' }
  return               { bg: '#F5F5F5',  text: '#8A8A8A' }
}

const URGENCY_DOT = {
  hot:  'bg-rust',
  warm: 'bg-[#C49A3C]',
  cold: 'bg-[#8A8A8A]',
}

export default function LeadRow({ contact, onClick }) {
  const { bg, text } = scoreColors(contact.score)
  const trigger = contactTriggers[contact.id]

  return (
    <div
      onClick={() => onClick(contact.id)}
      className="flex items-center gap-2.5 px-1 py-2 border-b border-[#F8F8F8] last:border-0 cursor-pointer hover:bg-[#FAFAFA] transition-colors rounded"
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
        style={{ backgroundColor: contact.avatarColor }}
      >
        {contact.avatar}
      </div>

      {/* Name + trigger or meta */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-navy leading-tight truncate">{contact.name}</p>
        {trigger ? (
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${URGENCY_DOT[trigger.urgency] ?? 'bg-slate'}`} />
            <p className="text-[10px] text-ink3 truncate">{trigger.text}</p>
          </div>
        ) : (
          <p className="text-[10px] text-ink3 truncate">{contact.lastContact} · {contact.source}</p>
        )}
      </div>

      {/* Score badge */}
      {contact.score != null && (
        <span
          className="text-[10px] font-semibold rounded px-1.5 py-0.5 shrink-0"
          style={{ backgroundColor: bg, color: text }}
        >
          {contact.score}
        </span>
      )}
    </div>
  )
}
