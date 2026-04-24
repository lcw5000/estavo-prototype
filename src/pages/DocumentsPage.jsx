// Estavo Prototype — DocumentsPage
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Download, Send, Search } from 'lucide-react'
import { documentTemplates, transactions, envelopes } from '../data/mockData'

// ── Unsigned Docs ─────────────────────────────────────────────────────────────

function buildUnsignedDocs() {
  const rows = []

  // From transaction documents with status 'sent'
  transactions.forEach(tx => {
    tx.documents.filter(d => d.status === 'sent').forEach(doc => {
      rows.push({
        id: doc.id + '-' + tx.id,
        docName: doc.name,
        txAddress: tx.address,
        txId: tx.id,
        dueDate: doc.dueDate,
        source: 'document',
        signersSigned: doc.signedBy ? 1 : 0,
        signersTotal: 2,
        signerNames: doc.signedBy ? [doc.signedBy] : [],
      })
    })
  })

  // From envelopes with pending signers
  envelopes.filter(e => ['sent', 'partial'].includes(e.status)).forEach(env => {
    const tx = transactions.find(t => t.id === env.txId)
    const pending = env.signers.filter(s => s.status === 'pending')
    const signed  = env.signers.filter(s => s.status === 'signed')
    rows.push({
      id: env.id,
      docName: env.name,
      txAddress: tx?.address ?? '—',
      txId: env.txId,
      dueDate: env.expiresAt?.slice(0, 10) ?? null,
      source: 'envelope',
      signersSigned: signed.length,
      signersTotal: env.signers.length,
      signerNames: pending.map(s => s.name),
    })
  })

  return rows
}

function dueCls(date) {
  if (!date) return 'text-ink3'
  const diff = (new Date(date + 'T12:00:00') - new Date()) / 86400000
  if (diff < 0)  return 'text-rust font-semibold'
  if (diff <= 3) return 'text-gold font-semibold'
  return 'text-ink3'
}

function fmtDate(str) {
  if (!str) return '—'
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function UnsignedRow({ row, onNavigate, onToast }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#F5F5F5] last:border-0">
      <FileText size={14} className="text-ink3 shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-navy truncate">{row.docName}</p>
        <button
          onClick={() => onNavigate(row.txId)}
          className="text-[10px] text-rust hover:underline truncate"
        >
          {row.txAddress} →
        </button>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[11px] text-navy font-medium">
          {row.signersSigned}/{row.signersTotal} signed
        </p>
        {row.signerNames.length > 0 && (
          <p className="text-[10px] text-ink3 truncate max-w-[140px]">
            Pending: {row.signerNames.join(', ')}
          </p>
        )}
      </div>

      {row.dueDate && (
        <span className={`text-[10px] shrink-0 ${dueCls(row.dueDate)}`}>
          Due {fmtDate(row.dueDate)}
        </span>
      )}

      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => onToast('Reminder sent to pending signers')}
          className="flex items-center gap-1 text-[10px] border border-rule rounded px-2 py-1 text-slate hover:bg-ui-bg transition-colors"
        >
          <Send size={10} /> Remind
        </button>
        <button
          onClick={() => onNavigate(row.txId)}
          className="text-[10px] border border-rust/30 text-rust rounded px-2 py-1 hover:bg-[#FDF0EE] transition-colors"
        >
          View
        </button>
      </div>
    </div>
  )
}

function UnsignedTab({ onToast }) {
  const navigate = useNavigate()
  const rows = buildUnsignedDocs()

  function goToTx(txId) {
    navigate(`/transactions/${txId}`)
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 bg-[#EEF6F2] rounded-full flex items-center justify-center">
          <FileText size={22} className="text-teal" />
        </div>
        <p className="text-[13px] font-semibold text-navy">All caught up</p>
        <p className="text-[11px] text-ink3">No documents are awaiting signatures.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-ink3">
          <span className="font-semibold text-navy">{rows.length}</span> document{rows.length !== 1 ? 's' : ''} awaiting signatures across all active transactions
        </p>
        <button
          onClick={() => onToast('Reminders sent to all pending signers')}
          className="flex items-center gap-1.5 text-[11px] border border-rule rounded-md px-3 py-1.5 text-slate hover:bg-ui-bg transition-colors"
        >
          <Send size={12} /> Remind all
        </button>
      </div>

      <div className="bg-white rounded-xl border border-rule px-4">
        {rows.map(row => (
          <UnsignedRow key={row.id} row={row} onNavigate={goToTx} onToast={onToast} />
        ))}
      </div>
    </div>
  )
}

// ── Templates ─────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Purchase', 'Representation', 'Disclosure', 'Contingency', 'Closing']

const CATEGORY_COLORS = {
  Purchase:       'bg-[#EEF2FC] text-[#2B4FA0]',
  Representation: 'bg-[#EEF6F2] text-teal',
  Disclosure:     'bg-[#FEF8EC] text-[#9A6A10]',
  Contingency:    'bg-[#FDF0EE] text-rust',
  Closing:        'bg-[#F5F5F5] text-slate',
}

function TemplateCard({ tpl, onToast }) {
  return (
    <div className="bg-white border border-rule rounded-xl p-4 flex flex-col gap-3 hover:border-[#C0BDB8] hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <FileText size={15} className="text-ink3 shrink-0 mt-0.5" />
          <p className="text-[12px] font-semibold text-navy leading-snug">{tpl.name}</p>
        </div>
        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[tpl.category]}`}>
          {tpl.category}
        </span>
      </div>

      <p className="text-[11px] text-ink3 leading-relaxed">{tpl.description}</p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-[10px] text-ink3">{tpl.pages} {tpl.pages === 1 ? 'page' : 'pages'}</span>
        <div className="flex gap-1.5">
          <button
            onClick={() => onToast(`${tpl.name} downloaded`)}
            className="flex items-center gap-1 text-[10px] border border-rule rounded px-2 py-1 text-slate hover:bg-ui-bg transition-colors"
          >
            <Download size={10} /> Download
          </button>
          <button
            onClick={() => onToast(`${tpl.name} added to new transaction`)}
            className="text-[10px] bg-rust text-white rounded px-2.5 py-1 hover:bg-[#B33D24] transition-colors"
          >
            Use template
          </button>
        </div>
      </div>
    </div>
  )
}

function TemplatesTab({ onToast }) {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = documentTemplates.filter(t => {
    const matchCat = category === 'All' || t.category === category
    const matchQ   = !query || t.name.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink3 pointer-events-none" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-ui-bg rounded-md pl-8 pr-3 py-1.5 text-[12px] text-navy placeholder:text-ink3 outline-none focus:ring-1 focus:ring-rule"
          />
        </div>
        <div className="flex gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-[11px] px-3 py-1.5 rounded-md transition-colors ${
                category === cat
                  ? 'bg-navy text-white'
                  : 'bg-white border border-rule text-slate hover:bg-ui-bg'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map(tpl => (
          <TemplateCard key={tpl.id} tpl={tpl} onToast={onToast} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-10 text-[12px] text-ink3">
            No templates match "{query}"
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

function Toast({ msg }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy text-white text-[12px] px-4 py-2.5 rounded-xl shadow-lg animate-page-in">
      {msg}
    </div>
  )
}

export default function DocumentsPage() {
  const [tab, setTab] = useState('unsigned')
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {[
          { value: 'unsigned', label: 'Unsigned docs' },
          { value: 'templates', label: 'Templates' },
        ].map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-1.5 text-[12px] rounded-md font-medium transition-colors ${
              tab === t.value
                ? 'bg-navy text-white'
                : 'bg-white border border-rule text-slate hover:bg-ui-bg'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'unsigned' && <UnsignedTab onToast={showToast} />}
      {tab === 'templates' && <TemplatesTab onToast={showToast} />}

      {toast && <Toast msg={toast} />}
    </div>
  )
}
