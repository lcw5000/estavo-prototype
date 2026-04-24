// Estavo Prototype — PipelinePage
import { useNavigate } from 'react-router-dom'
import { contacts, transactions, pipelineStages } from '../data/mockData'

// Map contacts to kanban columns
const txByContact = Object.fromEntries(transactions.map(t => [t.contactId, t]))

const COLUMNS = [
  {
    id: 'new',
    label: 'New Leads',
    color: '#2B4FA0',
    bg: '#EEF2FC',
    totalCount: 14,
    contactIds: ['contact-2'],
  },
  {
    id: 'nurturing',
    label: 'Nurturing',
    color: '#C49A3C',
    bg: '#FEF8EC',
    totalCount: 22,
    contactIds: ['contact-4', 'contact-5'],
  },
  {
    id: 'showing',
    label: 'Showing Scheduled',
    color: '#C84B2F',
    bg: '#FDF0EE',
    totalCount: 8,
    contactIds: [],
  },
  {
    id: 'offer',
    label: 'Offer / Negotiation',
    color: '#9A3020',
    bg: '#FBECE9',
    totalCount: 4,
    contactIds: ['contact-1'],
  },
  {
    id: 'contract',
    label: 'Under Contract',
    color: '#1A5C4A',
    bg: '#EEF6F2',
    totalCount: 3,
    contactIds: ['contact-3'],
  },
]

const contactMap = Object.fromEntries(contacts.map(c => [c.id, c]))

function scoreCls(score) {
  if (score == null) return 'bg-[#F5F5F5] text-[#8A8A8A]'
  if (score >= 90)   return 'bg-[#FDF0EE] text-rust font-semibold'
  if (score >= 70)   return 'bg-[#FEF8EC] text-[#9A6A10] font-semibold'
  if (score >= 50)   return 'bg-[#EEF2FC] text-[#2B4FA0] font-semibold'
  return 'bg-[#F5F5F5] text-[#8A8A8A]'
}

function fmtBudget(c) {
  if (!c.budget) return null
  return `$${(c.budget.min / 1000).toFixed(0)}K – $${(c.budget.max / 1000).toFixed(0)}K`
}

function ContactCard({ contact, onClick }) {
  const tx = txByContact[contact.id]
  const budget = fmtBudget(contact)

  return (
    <div
      onClick={() => onClick(contact.id)}
      className="bg-white border border-rule rounded-xl p-3 cursor-pointer hover:border-[#C0BDB8] hover:shadow-sm transition-all group"
    >
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0"
          style={{ backgroundColor: contact.avatarColor }}
        >
          {contact.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-navy leading-tight truncate group-hover:text-rust transition-colors">
            {contact.name}
          </p>
          {contact.source && (
            <p className="text-[10px] text-ink3 truncate">{contact.source}</p>
          )}
        </div>
        {contact.score != null && (
          <span className={`text-[11px] px-1.5 py-0.5 rounded-md shrink-0 ${scoreCls(contact.score)}`}>
            {contact.score}
          </span>
        )}
      </div>

      <div className="space-y-1 mb-2">
        {budget && (
          <p className="text-[11px] text-navy">{budget}</p>
        )}
        {contact.areas?.length > 0 && (
          <p className="text-[11px] text-ink3 truncate">{contact.areas.join(' · ')}</p>
        )}
        {contact.timeline && (
          <p className="text-[10px] text-ink3">{contact.timeline}</p>
        )}
      </div>

      {tx && (
        <div className="bg-[#EEF6F2] rounded-md px-2 py-1 mb-2">
          <p className="text-[10px] text-teal font-medium truncate">{tx.address}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {contact.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] bg-ui-bg text-slate border border-rule rounded px-1.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[9px] text-ink3 shrink-0 ml-1">{contact.lastContact}</span>
      </div>
    </div>
  )
}

function GhostCard() {
  return (
    <div className="bg-white border border-dashed border-rule rounded-xl p-3 opacity-40">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#E8E6E2]" />
        <div className="flex-1 space-y-1">
          <div className="h-2.5 bg-[#E8E6E2] rounded-full w-3/4" />
          <div className="h-2 bg-[#E8E6E2] rounded-full w-1/2" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 bg-[#E8E6E2] rounded-full w-full" />
        <div className="h-2 bg-[#E8E6E2] rounded-full w-2/3" />
      </div>
    </div>
  )
}

function KanbanColumn({ col, onCardClick }) {
  const colContacts = col.contactIds.map(id => contactMap[id]).filter(Boolean)
  const remaining = col.totalCount - colContacts.length
  const totalBudget = colContacts
    .filter(c => c.budget)
    .reduce((sum, c) => sum + (c.budget.min + c.budget.max) / 2, 0)

  return (
    <div className="flex flex-col w-[240px] shrink-0">
      {/* Column header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
            <p className="text-[11px] font-semibold text-navy">{col.label}</p>
          </div>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: col.bg, color: col.color }}
          >
            {col.totalCount}
          </span>
        </div>
        {totalBudget > 0 && (
          <p className="text-[10px] text-ink3 pl-4">
            ~${(totalBudget / 1000000).toFixed(1)}M avg budget
          </p>
        )}
        <div className="h-0.5 rounded-full mt-2" style={{ backgroundColor: col.color, opacity: 0.25 }} />
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2.5">
        {colContacts.map(c => (
          <ContactCard key={c.id} contact={c} onClick={onCardClick} />
        ))}

        {/* Ghost cards for remaining */}
        {remaining > 0 && colContacts.length === 0 && (
          <>
            <GhostCard />
            <GhostCard />
          </>
        )}

        {/* More contacts indicator */}
        {remaining > 0 && (
          <button
            onClick={() => onCardClick(null)}
            className="w-full text-center py-2 text-[11px] text-ink3 hover:text-navy border border-dashed border-rule rounded-xl transition-colors"
            style={{ borderColor: col.color + '40' }}
          >
            +{remaining} more
          </button>
        )}
      </div>
    </div>
  )
}

export default function PipelinePage() {
  const navigate = useNavigate()

  const totalContacts = pipelineStages.reduce((s, p) => s + p.count, 0)
  const totalBudget = contacts
    .filter(c => c.budget)
    .reduce((s, c) => s + (c.budget.min + c.budget.max) / 2, 0)

  function handleCardClick(id) {
    if (id) navigate(`/contacts/${id}`)
    else navigate('/contacts')
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="grid grid-cols-5 gap-3">
        {pipelineStages.map((stage, i) => {
          const col = COLUMNS[i]
          return (
            <div key={stage.label} className="bg-white border border-rule rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                <p className="text-[10px] text-ink3 truncate">{stage.label}</p>
              </div>
              <p className="text-[20px] font-semibold text-navy leading-none">{stage.count}</p>
            </div>
          )
        })}
      </div>

      {/* Funnel bar */}
      <div className="bg-white border border-rule rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-semibold text-navy">Pipeline funnel — {totalContacts} contacts</p>
          <button onClick={() => navigate('/contacts')} className="text-[10px] text-rust hover:underline">
            View all →
          </button>
        </div>
        <div className="flex rounded-lg overflow-hidden h-5">
          {pipelineStages.map(stage => (
            <div
              key={stage.label}
              className="relative group"
              style={{ width: `${(stage.count / totalContacts) * 100}%`, backgroundColor: stage.color }}
            >
              <div className="hidden group-hover:flex absolute bottom-7 left-1/2 -translate-x-1/2 bg-navy text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10">
                {stage.label}: {stage.count}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-ink3">{pipelineStages[0].label}</span>
          <span className="text-[10px] text-ink3">{pipelineStages[pipelineStages.length - 1].label}</span>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <KanbanColumn key={col.id} col={col} onCardClick={handleCardClick} />
        ))}
      </div>
    </div>
  )
}
