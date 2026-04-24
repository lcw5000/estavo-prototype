// Estavo Prototype — ContactTimeline

const DOT_COLOR = {
  email_opened:    '#2B4FA0',
  email_sent:      '#2B4FA0',
  lead_created:    '#2B4FA0',
  sms_replied:     '#1A5C4A',
  sms_sent:        '#1A5C4A',
  document_signed: '#1A5C4A',
  showing_attended:'#C84B2F',
  listing_saved:   '#C49A3C',
  campaign_stat:   '#C49A3C',
  ai_suggestion:   '#C49A3C',
}

export default function ContactTimeline({ contactId, interactions }) {
  const items = [...interactions]
    .filter(i => i.contactId === contactId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  if (!items.length) {
    return (
      <div className="bg-white rounded-xl border border-rule p-3">
        <p className="text-[11px] text-ink3">No interactions recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-rule p-3">
      <div className="border-l border-rule ml-1.5 pl-3">
        {items.map(item => (
          <div key={item.id} className="relative py-1.5">
            <div
              className="absolute -left-[17px] top-[9px] w-2 h-2 rounded-full ring-2 ring-white"
              style={{ backgroundColor: DOT_COLOR[item.type] ?? '#8A8A8A' }}
            />
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] text-navy leading-relaxed">{item.description}</p>
              <span className="text-[9px] text-ink3 shrink-0 whitespace-nowrap">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
