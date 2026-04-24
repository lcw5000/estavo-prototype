// Estavo Prototype — Topbar
import { useState, useRef, useEffect } from 'react'
import { Search, X, Plus, UserPlus, FileText, CalendarPlus, Zap, Megaphone, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { contacts } from '../../data/mockData'

const QUICK_ACTIONS = [
  {
    group: 'Contacts & Leads',
    items: [
      { icon: UserPlus,    label: 'Add contact',      sub: 'Create a new contact record',    path: '/contacts' },
      { icon: Zap,         label: 'Add lead',         sub: 'Log an inbound lead manually',   path: '/leads' },
    ],
  },
  {
    group: 'Transactions & Showings',
    items: [
      { icon: FileText,    label: 'New transaction',  sub: 'Start a deal or listing',        path: '/transactions' },
      { icon: CalendarPlus,label: 'Schedule showing', sub: 'Book a property viewing',        path: '/showings' },
    ],
  },
  {
    group: 'Marketing',
    items: [
      { icon: Megaphone,   label: 'New AI campaign',  sub: 'Launch a drip or blast',         path: '/campaigns' },
    ],
  },
]

function QuickActionsMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, right: 0 })

  useEffect(() => {
    function onMouseDown(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function toggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 6, right: window.innerWidth - r.right })
    }
    setOpen(o => !o)
  }

  function handleAction(path) {
    navigate(path)
    setOpen(false)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-rust bg-[#FADDDA] font-medium rounded-md hover:bg-[#F5CBC7] transition-colors"
      >
        <Plus size={11} />
        New
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 200, backgroundColor: '#ffffff' }}
          className="w-64 rounded-xl border border-rule shadow-lg overflow-hidden"
        >
          {QUICK_ACTIONS.map((group, gi) => (
            <div key={group.group}>
              {gi > 0 && <div className="h-px bg-rule mx-3" />}
              <p className="text-[9px] font-semibold text-ink3 uppercase tracking-wider px-3 pt-2.5 pb-1">
                {group.group}
              </p>
              {group.items.map(action => (
                <button
                  key={action.label}
                  onClick={() => handleAction(action.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-ui-bg transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FADDDA] flex items-center justify-center shrink-0">
                    <action.icon size={13} className="text-rust" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-navy">{action.label}</p>
                    <p className="text-[10px] text-ink3">{action.sub}</p>
                  </div>
                </button>
              ))}
              {gi === QUICK_ACTIONS.length - 1 && <div className="h-2" />}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
})


function matchContact(c, q) {
  const lower = q.toLowerCase()
  if (c.name.toLowerCase().includes(lower))        return { field: 'name' }
  if (c.email?.toLowerCase().includes(lower))      return { field: 'email', value: c.email }
  if (c.phone?.includes(q))                        return { field: 'phone', value: c.phone }
  if (c.tags?.some(t => t.toLowerCase().includes(lower)))
    return { field: 'tag', value: c.tags.find(t => t.toLowerCase().includes(lower)) }
  if (c.areas?.some(a => a.toLowerCase().includes(lower)))
    return { field: 'area', value: c.areas.find(a => a.toLowerCase().includes(lower)) }
  if (c.source?.toLowerCase().includes(lower))     return { field: 'source', value: c.source }
  return null
}

function SearchBox() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  const results = query.trim().length < 1 ? [] : contacts
    .map(c => ({ contact: c, match: matchContact(c, query.trim()) }))
    .filter(r => r.match !== null)
    .slice(0, 6)

  useEffect(() => {
    function onMouseDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleKey(e) {
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
    if (e.key === 'Enter' && results.length > 0) {
      navigate(`/contacts/${results[0].contact.id}`)
      setQuery(''); setOpen(false)
    }
  }

  function handleSelect(id) {
    navigate(`/contacts/${id}`)
    setQuery(''); setOpen(false)
  }

  function handleChange(e) {
    setQuery(e.target.value)
    setOpen(true)
  }

  const showDropdown = open && query.trim().length > 0

  return (
    <div ref={wrapRef} className="relative">
      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink3 pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => query && setOpen(true)}
        onKeyDown={handleKey}
        placeholder="Search contacts..."
        className={`bg-ui-bg rounded-md pl-8 pr-7 py-1.5 text-sub text-navy placeholder:text-ink3 outline-none focus:ring-1 focus:ring-rule transition-all ${
          showDropdown ? 'w-72 rounded-b-none ring-1 ring-rule' : 'w-48 focus:w-72'
        }`}
      />
      {query && (
        <button
          onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-ink3 hover:text-navy"
        >
          <X size={12} />
        </button>
      )}

      {showDropdown && (
        <div className="absolute top-full left-0 w-72 bg-white border border-rule border-t-0 rounded-b-lg shadow-lg z-50 overflow-hidden">
          {results.length === 0 ? (
            <p className="text-[11px] text-ink3 px-3 py-3">No contacts found for "{query}"</p>
          ) : (
            <ul>
              {results.map(({ contact: c, match }) => (
                <li key={c.id}>
                  <button
                    onClick={() => handleSelect(c.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-ui-bg transition-colors text-left"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
                      style={{ backgroundColor: c.avatarColor }}
                    >
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-navy font-medium truncate">
                        {c.name}
                      </p>
                      {match.field !== 'name' && match.value && (
                        <p className="text-[10px] text-ink3 truncate">
                          {match.value}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 shrink-0">
                      {c.tags?.slice(0, 1).map(tag => (
                        <span key={tag} className="text-[9px] bg-ui-bg text-slate border border-rule rounded px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                </li>
              ))}
              {results.length > 0 && (
                <li className="border-t border-rule">
                  <button
                    onClick={() => { navigate('/contacts'); setQuery(''); setOpen(false) }}
                    className="w-full px-3 py-2 text-[11px] text-rust hover:bg-ui-bg transition-colors text-left"
                  >
                    See all results →
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default function Topbar({ title }) {
  return (
    <header className="h-12 bg-white border-b border-rule flex items-center px-4 gap-3 shrink-0">
      <h1 className="text-page font-semibold text-navy shrink-0">{title}</h1>

      <div className="hidden md:block">
        <SearchBox />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sub text-slate hidden lg:block select-none">{today}</span>
        <QuickActionsMenu />
      </div>
    </header>
  )
}
