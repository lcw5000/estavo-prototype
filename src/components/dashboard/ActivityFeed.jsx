// Estavo Prototype — ActivityFeed
import { useNavigate } from 'react-router-dom'
import { interactions } from '../../data/mockData'

const DOT_COLOR = {
  email_opened:    '#1A5C4A',
  lead_created:    '#2B4FA0',
  listing_saved:   '#C49A3C',
  campaign_stat:   '#C49A3C',
  document_signed: '#C84B2F',
  sms_replied:     '#1A5C4A',
  showing_attended:'#C84B2F',
}

export default function ActivityFeed() {
  const navigate = useNavigate()
  const sorted = [...interactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8)

  return (
    <div className="h-full bg-white border border-rule rounded-xl p-4 overflow-y-auto">
      <p className="text-[12px] font-semibold text-navy mb-3">Recent activity</p>
      <div className="space-y-2">
        {sorted.map(item => (
          <div
            key={item.id}
            onClick={() => navigate(`/contacts/${item.contactId}`)}
            className="flex items-start gap-2.5 -mx-1 px-1 py-1 rounded cursor-pointer hover:bg-ui-bg transition-colors"
          >
            <div
              className="w-2 h-2 rounded-full mt-[5px] shrink-0"
              style={{ backgroundColor: DOT_COLOR[item.type] ?? '#8A8A8A' }}
            />
            <p className="text-[10px] text-navy leading-relaxed flex-1">{item.description}</p>
            <span className="text-[9px] text-ink3 shrink-0 whitespace-nowrap">{item.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
