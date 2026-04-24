// Estavo Prototype — CampaignList
import { useNavigate } from 'react-router-dom'

const STATUS_BADGE = {
  active: { label: 'Active', cls: 'bg-[#E6F4EE] text-teal' },
  paused: { label: 'Paused', cls: 'bg-[#FEF3E2] text-[#9A6A10]' },
  draft:  { label: 'Draft',  cls: 'bg-[#F5F5F5] text-ink3' },
}

export default function CampaignList({ campaigns, selectedId, onSelect }) {
  const navigate = useNavigate()

  return (
    <div className="w-[220px] shrink-0 bg-white border-r border-rule flex flex-col overflow-hidden">
      <div className="px-3 pt-3 pb-2 border-b border-rule shrink-0">
        <p className="text-[12px] font-semibold text-navy">
          My campaigns
          <span className="ml-1.5 text-[10px] text-ink3 font-normal">{campaigns.length}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {campaigns.map(campaign => {
          const isSelected = campaign.id === selectedId
          const badge = STATUS_BADGE[campaign.status] ?? STATUS_BADGE.draft
          return (
            <div
              key={campaign.id}
              onClick={() => { onSelect(campaign.id); navigate(`/campaigns/${campaign.id}`) }}
              className={`px-3 py-3 cursor-pointer border-l-[3px] border-b border-[#F5F5F5] transition-colors ${
                isSelected ? 'border-l-rust bg-[#FDF0EE]' : 'border-l-transparent hover:bg-[#FAFAFA]'
              }`}
            >
              <p className="text-[12px] font-medium text-navy mb-1.5 leading-tight">{campaign.name}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-ink3">{campaign.contactCount} contacts</span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
