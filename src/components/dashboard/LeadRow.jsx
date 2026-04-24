// Estavo Prototype — LeadRow

function scoreColors(score) {
  if (score == null)  return { bg: '#EEF2FC', text: '#2B4FA0' }
  if (score >= 80)    return { bg: '#FDF0EE', text: '#C84B2F' }
  if (score >= 60)    return { bg: '#FEF8EC', text: '#9A6A10' }
  if (score >= 40)    return { bg: '#EEF2FC', text: '#2B4FA0' }
  return               { bg: '#F5F5F5',  text: '#8A8A8A' }
}

function chipLabel(score) {
  if (score == null) return 'Contract'
  if (score >= 80)   return 'Follow up'
  if (score >= 60)   return 'Book showing'
  return 'Nurture'
}

export default function LeadRow({ contact, onClick }) {
  const { bg, text } = scoreColors(contact.score)
  const chip = chipLabel(contact.score)

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

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-navy leading-tight truncate">{contact.name}</p>
        <p className="text-[10px] text-ink3 truncate">{contact.lastContact} · {contact.source}</p>
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

      {/* AI action chip */}
      <span
        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm text-white shrink-0"
        style={{ backgroundColor: contact.score == null ? '#1A5C4A' : text }}
      >
        {chip}
      </span>
    </div>
  )
}
