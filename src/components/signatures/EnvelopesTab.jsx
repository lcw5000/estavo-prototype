// Estavo Prototype — EnvelopesTab
// Shows all signing envelopes for a transaction
import { useState } from 'react'
import { Plus, Send, Download, Clock, Check, X, AlertCircle, PenLine } from 'lucide-react'
import { envelopes as initialEnvelopes } from '../../data/mockData'
import SignatureEnvelopeModal from './SignatureEnvelopeModal'
import SigningExperienceModal from './SigningExperienceModal'

function fmtTime(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function statusConfig(status) {
  const map = {
    complete: { label: 'Complete',    cls: 'bg-[#EEF6F2] text-teal',        icon: Check },
    partial:  { label: 'Partial',     cls: 'bg-[#FEF8EC] text-[#9A6A10]',   icon: Clock },
    sent:     { label: 'Awaiting',    cls: 'bg-[#FEF8EC] text-[#9A6A10]',   icon: Clock },
    draft:    { label: 'Draft',       cls: 'bg-[#F5F5F5] text-[#8A8A8A]',   icon: AlertCircle },
    voided:   { label: 'Voided',      cls: 'bg-[#F5F5F5] text-[#8A8A8A]',   icon: X },
  }
  return map[status] ?? { label: status, cls: 'bg-[#F5F5F5] text-[#8A8A8A]', icon: AlertCircle }
}

function signerDot(status) {
  if (status === 'signed')   return 'bg-teal'
  if (status === 'pending')  return 'bg-gold'
  if (status === 'declined') return 'bg-rust'
  return 'bg-rule'
}

function EnvelopeCard({ envelope, onResend, onVoid, onSign, onToast }) {
  const { label, cls, icon: Icon } = statusConfig(envelope.status)
  const isActive = ['sent', 'partial'].includes(envelope.status)
  const agentSigner = envelope.signers.find(s => s.isAgent && s.status === 'pending')

  return (
    <div className="bg-white border border-rule rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[13px] font-semibold text-navy truncate">{envelope.name}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 shrink-0 ${cls}`}>
              <Icon size={10} /> {label}
            </span>
          </div>
          <p className="text-[11px] text-ink3">
            Sent {fmtTime(envelope.sentAt)}
            {envelope.completedAt && ` · Completed ${fmtTime(envelope.completedAt)}`}
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {envelope.status === 'complete' && (
            <button
              onClick={() => onToast('Signed envelope downloaded')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors"
            >
              <Download size={12} /> Download
            </button>
          )}
          {isActive && agentSigner && (
            <button
              onClick={() => onSign(envelope)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] bg-rust text-white rounded-md hover:bg-[#B33D24] transition-colors"
            >
              <PenLine size={12} /> Sign now
            </button>
          )}
          {isActive && (
            <button
              onClick={() => onResend(envelope.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors"
            >
              <Send size={12} /> Remind
            </button>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="flex flex-wrap gap-1.5">
        {envelope.documentNames.map((name, i) => (
          <span key={i} className="text-[10px] bg-ui-bg text-slate border border-rule rounded-md px-2 py-0.5 truncate max-w-[220px]">
            {name}
          </span>
        ))}
      </div>

      {/* Signers */}
      <div className="space-y-1.5">
        {envelope.signers.map(signer => (
          <div key={signer.id} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full shrink-0 ${signerDot(signer.status)}`} />
            <p className="text-[11px] text-navy flex-1 min-w-0 truncate">
              {signer.name}
              <span className="text-ink3"> · {signer.role}</span>
            </p>
            {signer.status === 'signed' && signer.signedAt ? (
              <span className="text-[10px] text-teal shrink-0">Signed {fmtTime(signer.signedAt)}</span>
            ) : signer.status === 'pending' ? (
              <span className="text-[10px] text-[#9A6A10] shrink-0">Pending</span>
            ) : (
              <span className="text-[10px] text-rust shrink-0 capitalize">{signer.status}</span>
            )}
          </div>
        ))}
      </div>

      {isActive && (
        <div className="flex justify-end pt-1">
          <button
            onClick={() => onVoid(envelope.id)}
            className="text-[10px] text-ink3 hover:text-rust transition-colors"
          >
            Void envelope
          </button>
        </div>
      )}
    </div>
  )
}

export default function EnvelopesTab({ transaction, onToast }) {
  const txEnvelopes = initialEnvelopes.filter(e => e.txId === transaction.id)
  const [envelopes, setEnvelopes] = useState(txEnvelopes)
  const [createOpen, setCreateOpen] = useState(false)
  const [signingEnvelope, setSigningEnvelope] = useState(null)

  function handleResend(id) {
    const env = envelopes.find(e => e.id === id)
    const pending = env?.signers.filter(s => s.status === 'pending') ?? []
    onToast(`Reminder sent to ${pending.map(s => s.name).join(', ')}`)
  }

  function handleVoid(id) {
    setEnvelopes(prev => prev.map(e => e.id === id ? { ...e, status: 'voided' } : e))
    onToast('Envelope voided')
  }

  function handleSent(data) {
    const newEnvelope = {
      id: 'env-' + Date.now(),
      txId: transaction.id,
      name: data.name,
      status: 'sent',
      docusealId: null,
      sentAt: new Date().toISOString(),
      completedAt: null,
      expiresAt: null,
      documentIds: data.documentIds,
      documentNames: data.documentNames,
      signers: data.signers.map((s, i) => ({
        ...s,
        id: 'sgn-new-' + i,
        status: 'pending',
        signedAt: null,
        isAgent: s.email === 'lee@remax.com',
      })),
      message: data.message,
    }
    setEnvelopes(prev => [newEnvelope, ...prev])
    onToast(`Envelope sent · ${data.signers.length} signer${data.signers.length !== 1 ? 's' : ''} notified by email`)
  }

  function handleSignComplete() {
    if (!signingEnvelope) return
    setEnvelopes(prev => prev.map(e => {
      if (e.id !== signingEnvelope.id) return e
      const updatedSigners = e.signers.map(s =>
        s.isAgent ? { ...s, status: 'signed', signedAt: new Date().toISOString() } : s
      )
      const allSigned = updatedSigners.every(s => s.status === 'signed')
      return { ...e, signers: updatedSigners, status: allSigned ? 'complete' : 'partial', completedAt: allSigned ? new Date().toISOString() : null }
    }))
    onToast('Signature submitted · DocuSeal will notify remaining signers')
    setSigningEnvelope(null)
  }

  const active = envelopes.filter(e => ['sent', 'partial'].includes(e.status))
  const completed = envelopes.filter(e => e.status === 'complete')
  const other = envelopes.filter(e => !['sent', 'partial', 'complete'].includes(e.status))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-navy">E-Signatures</p>
          <p className="text-[11px] text-ink3">Powered by DocuSeal · ESIGN / UETA compliant</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] bg-rust text-white rounded-md hover:bg-[#B33D24] transition-colors"
        >
          <Plus size={13} /> New envelope
        </button>
      </div>

      {active.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink3 mb-2">Awaiting signatures</p>
          <div className="space-y-3">
            {active.map(e => (
              <EnvelopeCard key={e.id} envelope={e} onResend={handleResend} onVoid={handleVoid} onSign={setSigningEnvelope} onToast={onToast} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink3 mb-2">Completed</p>
          <div className="space-y-3">
            {completed.map(e => (
              <EnvelopeCard key={e.id} envelope={e} onResend={handleResend} onVoid={handleVoid} onSign={setSigningEnvelope} onToast={onToast} />
            ))}
          </div>
        </div>
      )}

      {other.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink3 mb-2">Other</p>
          <div className="space-y-3">
            {other.map(e => (
              <EnvelopeCard key={e.id} envelope={e} onResend={handleResend} onVoid={handleVoid} onSign={setSigningEnvelope} onToast={onToast} />
            ))}
          </div>
        </div>
      )}

      {envelopes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white border border-rule rounded-xl">
          <PenLine size={28} className="text-ink3" />
          <div className="text-center">
            <p className="text-[13px] font-semibold text-navy mb-0.5">No envelopes yet</p>
            <p className="text-[11px] text-ink3">Create your first envelope to send documents for signature.</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2 text-[11px] bg-rust text-white rounded-md hover:bg-[#B33D24] transition-colors"
          >
            Create envelope
          </button>
        </div>
      )}

      <SignatureEnvelopeModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        transaction={transaction}
        onSent={handleSent}
      />

      <SigningExperienceModal
        open={!!signingEnvelope}
        onOpenChange={open => !open && setSigningEnvelope(null)}
        envelopeName={signingEnvelope?.name}
        onComplete={handleSignComplete}
      />
    </div>
  )
}
