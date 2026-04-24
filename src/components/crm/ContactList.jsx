// Estavo Prototype — ContactList
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, Users } from 'lucide-react'

function scoreColors(score) {
  if (score == null) return { bg: '#E6F4EE', text: '#1A5C4A' }
  if (score >= 80)   return { bg: '#FDF0EE', text: '#C84B2F' }
  if (score >= 60)   return { bg: '#FEF8EC', text: '#9A6A10' }
  if (score >= 40)   return { bg: '#EEF2FC', text: '#2B4FA0' }
  return              { bg: '#F5F5F5',  text: '#8A8A8A' }
}

const SORTS = [
  { key: 'ai',     label: '🔥 AI' },
  { key: 'name',   label: 'A–Z' },
  { key: 'recent', label: 'Recent' },
]

function sortContacts(contacts, sort) {
  const c = [...contacts]
  if (sort === 'ai')     return c.sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
  if (sort === 'name')   return c.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'recent') return c.sort((a, b) => new Date(b.lastContactDate) - new Date(a.lastContactDate))
  return c
}

export default function ContactList({ contacts, selectedId, onSelect }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('ai')

  const filtered = sortContacts(contacts, sort)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="w-[240px] shrink-0 bg-white border-r border-rule flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-rule">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-semibold text-navy">
            Contacts
            <span className="ml-1.5 text-[10px] text-ink3 font-normal">{contacts.length}</span>
          </p>
          <button className="text-ink3 hover:text-navy transition-colors p-0.5">
            <Filter size={13} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-ui-bg rounded-md px-2.5 py-1.5 text-[11px] text-navy placeholder:text-ink3 outline-none"
        />
      </div>

      {/* Sort bar */}
      <div className="px-3 py-1.5 bg-ui-bg border-b border-rule flex items-center gap-1">
        {SORTS.map(s => (
          <button
            key={s.key}
            onClick={() => setSort(s.key)}
            className={`text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded transition-colors ${
              sort === s.key
                ? 'bg-navy text-white'
                : 'text-ink3 hover:text-navy'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-ink3">
            <Users size={20} />
            <p className="text-[11px]">No contacts match your search</p>
          </div>
        )}
        {filtered.map(contact => {
          const isSelected = contact.id === selectedId
          const { bg, text } = scoreColors(contact.score)
          return (
            <div
              key={contact.id}
              onClick={() => { onSelect(contact.id); navigate(`/contacts/${contact.id}`) }}
              className={`px-3 py-2.5 cursor-pointer border-l-[3px] border-b border-[#F5F5F5] transition-colors ${
                isSelected ? 'border-l-rust bg-[#FDF0EE]' : 'border-l-transparent hover:bg-[#FAFAFA]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
                  style={{ backgroundColor: contact.avatarColor }}
                >
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="text-[12px] font-medium text-navy truncate">{contact.name}</p>
                    {contact.stage === 'under_contract' ? (
                      <span className="text-teal text-[11px] shrink-0">✓</span>
                    ) : contact.score != null ? (
                      <span className="text-[9px] font-semibold px-1 py-0.5 rounded shrink-0"
                        style={{ backgroundColor: bg, color: text }}>
                        {contact.score}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[10px] text-ink3 truncate">{contact.lastContact}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
