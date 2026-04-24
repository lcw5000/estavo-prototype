// Estavo Prototype — DocumentChecklist
import { useState } from 'react'
import { FileText, Download, ChevronDown } from 'lucide-react'

const STAGE_ORDER = ['pre-offer', 'offer', 'contingency', 'escrow', 'closing']
const STAGE_LABELS = {
  'pre-offer':   'Pre-Offer',
  'offer':       'Offer',
  'contingency': 'Contingency',
  'escrow':      'Escrow',
  'closing':     'Closing',
}

function statusBadge(status) {
  const map = {
    signed:      { cls: 'bg-[#EEF6F2] text-teal',          label: '✓ Signed' },
    received:    { cls: 'bg-[#EEF2FC] text-[#2B4FA0]',     label: 'Received' },
    sent:        { cls: 'bg-[#FEF8EC] text-[#9A6A10]',     label: 'Awaiting signature' },
    pending:     { cls: 'bg-[#FEF8EC] text-[#9A6A10]',     label: 'Pending' },
    not_started: { cls: 'bg-[#F5F5F5] text-[#8A8A8A]',     label: 'Not started' },
    waived:      { cls: 'bg-[#F5F5F5] text-[#8A8A8A]',     label: 'Waived' },
  }
  return map[status] ?? { cls: 'bg-[#F5F5F5] text-[#8A8A8A]', label: status }
}

function dueDateCls(dueDate) {
  if (!dueDate) return 'text-[#8A8A8A]'
  const d = new Date(dueDate + 'T12:00:00')
  const now = new Date()
  const diff = (d - now) / (1000 * 60 * 60 * 24)
  if (diff < 0)  return 'text-rust font-medium'
  if (diff <= 3) return 'text-gold font-medium'
  return 'text-[#8A8A8A]'
}

function fmtDate(str) {
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function DocRow({ doc, onToast, onRequestSig }) {
  const { cls, label } = statusBadge(doc.status)
  const needsAction = ['pending', 'not_started'].includes(doc.status)
  const needsRemind = doc.status === 'sent'
  const canDownload = ['signed', 'received'].includes(doc.status)

  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-[#F5F5F5] last:border-0">
      <FileText size={13} className="text-ink3 shrink-0" />
      <p className="text-[12px] text-navy flex-1 min-w-0 truncate">{doc.name}</p>
      <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${cls}`}>{label}</span>

      {canDownload && (
        <button onClick={() => onToast('Document downloaded')} className="text-ink3 hover:text-navy p-1 transition-colors">
          <Download size={12} />
        </button>
      )}
      {needsRemind && (
        <button onClick={() => onToast('Reminder sent')}
          className="text-[10px] text-[#9A6A10] border border-[#9A6A10]/30 rounded px-2 py-0.5 hover:bg-[#FEF8EC] transition-colors shrink-0">
          Remind
        </button>
      )}
      {needsAction && (
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onToast('Document uploaded')}
            className="text-[10px] text-slate border border-rule rounded px-2 py-0.5 hover:bg-ui-bg transition-colors">
            Upload
          </button>
          <button onClick={() => onRequestSig?.(doc)}
            className="text-[10px] text-rust border border-rust/30 rounded px-2 py-0.5 hover:bg-[#FDF0EE] transition-colors">
            Request sig
          </button>
        </div>
      )}

      {doc.dueDate && (
        <span className={`text-[10px] shrink-0 ${dueDateCls(doc.dueDate)}`}>
          Due {fmtDate(doc.dueDate)}
        </span>
      )}
    </div>
  )
}

function StageGroup({ stage, docs, onToast, onRequestSig }) {
  const [open, setOpen] = useState(true)
  const complete = docs.filter(d => ['signed', 'received'].includes(d.status)).length

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-2 group"
      >
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink3">
            {STAGE_LABELS[stage] ?? stage}
          </p>
          <span className="text-[10px] text-ink3">{complete}/{docs.length} complete</span>
        </div>
        <ChevronDown size={13} className={`text-ink3 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && (
        <div className="bg-white rounded-xl border border-rule px-3">
          {docs.map(doc => <DocRow key={doc.id} doc={doc} onToast={onToast} onRequestSig={onRequestSig} />)}
        </div>
      )}
    </div>
  )
}

export default function DocumentChecklist({ documents, onToast, onRequestSig }) {
  const grouped = STAGE_ORDER.reduce((acc, stage) => {
    const docs = documents.filter(d => d.stage === stage)
    if (docs.length) acc[stage] = docs
    return acc
  }, {})

  return (
    <div>
      {Object.entries(grouped).map(([stage, docs]) => (
        <StageGroup key={stage} stage={stage} docs={docs} onToast={onToast} onRequestSig={onRequestSig} />
      ))}
    </div>
  )
}
