// Estavo Prototype — SignatureEnvelopeModal
// Create and send a new signing envelope via DocuSeal
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Plus, X, ChevronRight, Check } from 'lucide-react'

const STEPS = ['Documents', 'Signers', 'Send']

function stepCls(step, current) {
  if (step < current)  return 'text-teal'
  if (step === current) return 'text-rust'
  return 'text-ink3'
}

function buildDefaultSigners(parties) {
  const signers = []
  if (parties?.buyer)       signers.push({ id: 's1', name: parties.buyer.name, email: parties.buyer.email, role: 'Buyer' })
  if (parties?.seller)      signers.push({ id: 's2', name: parties.seller.name, email: parties.seller.email ?? '', role: 'Seller' })
  if (parties?.listingAgent) signers.push({ id: 's3', name: parties.listingAgent.name, email: parties.listingAgent.email, role: 'Listing Agent' })
  signers.push({ id: 's-agent', name: 'Lee (You)', email: 'lee@remax.com', role: 'Agent' })
  return signers
}

function DocCheckbox({ doc, selected, onToggle }) {
  return (
    <label className="flex items-start gap-3 py-2.5 border-b border-[#F5F5F5] last:border-0 cursor-pointer group">
      <input
        type="checkbox"
        className="mt-0.5 accent-rust"
        checked={selected}
        onChange={() => onToggle(doc.id)}
      />
      <div>
        <p className="text-[12px] text-navy font-medium group-hover:text-rust transition-colors">{doc.name}</p>
        <p className="text-[10px] text-ink3 capitalize">{doc.stage} · {doc.status.replace(/_/g, ' ')}</p>
      </div>
    </label>
  )
}

function SignerRow({ signer, onRemove, onChange }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-[#F5F5F5] last:border-0">
      <div className="flex-1 grid grid-cols-3 gap-2">
        <input
          value={signer.name}
          onChange={e => onChange(signer.id, 'name', e.target.value)}
          placeholder="Name"
          className="text-[11px] border border-rule rounded-md px-2 py-1.5 text-navy outline-none focus:border-rust"
        />
        <input
          value={signer.email}
          onChange={e => onChange(signer.id, 'email', e.target.value)}
          placeholder="Email"
          className="text-[11px] border border-rule rounded-md px-2 py-1.5 text-navy outline-none focus:border-rust"
        />
        <select
          value={signer.role}
          onChange={e => onChange(signer.id, 'role', e.target.value)}
          className="text-[11px] border border-rule rounded-md px-2 py-1.5 text-navy outline-none focus:border-rust bg-white"
        >
          {['Buyer', 'Co-Buyer', 'Seller', 'Co-Seller', 'Agent', 'Listing Agent', 'Other'].map(r => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <button onClick={() => onRemove(signer.id)} className="text-ink3 hover:text-rust p-1 shrink-0">
        <X size={13} />
      </button>
    </div>
  )
}

export default function SignatureEnvelopeModal({ open, onOpenChange, transaction, preSelectedDocIds = [], onSent }) {
  const [step, setStep] = useState(0)
  const [selectedDocs, setSelectedDocs] = useState(new Set(preSelectedDocIds))
  const [signers, setSigners] = useState(() => buildDefaultSigners(transaction?.parties))
  const [message, setMessage] = useState('')
  const [envelopeName, setEnvelopeName] = useState('Signature Request')

  const docs = transaction?.documents ?? []

  function toggleDoc(id) {
    setSelectedDocs(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function addSigner() {
    const id = 's-' + Date.now()
    setSigners(prev => [...prev, { id, name: '', email: '', role: 'Other' }])
  }

  function removeSigner(id) {
    setSigners(prev => prev.filter(s => s.id !== id))
  }

  function changeSigner(id, field, value) {
    setSigners(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  function handleClose() {
    onOpenChange(false)
    setStep(0)
    setSelectedDocs(new Set(preSelectedDocIds))
    setSigners(buildDefaultSigners(transaction?.parties))
    setMessage('')
  }

  function handleSend() {
    onSent?.({
      documentIds: [...selectedDocs],
      documentNames: docs.filter(d => selectedDocs.has(d.id)).map(d => d.name),
      signers,
      message,
      name: envelopeName,
    })
    handleClose()
  }

  const canProceedStep0 = selectedDocs.size > 0
  const canProceedStep1 = signers.length > 0 && signers.every(s => s.name && s.email)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-[13px] font-semibold text-navy">Send for signature</DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center gap-1 px-5 pt-3 pb-4">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`flex items-center gap-1.5 text-[11px] font-medium ${stepCls(i, step)}`}>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                  i < step ? 'bg-teal border-teal text-white' :
                  i === step ? 'border-rust text-rust' :
                  'border-rule text-ink3'
                }`}>
                  {i < step ? <Check size={10} /> : i + 1}
                </span>
                {label}
              </div>
              {i < STEPS.length - 1 && <ChevronRight size={13} className="text-ink3 mx-0.5" />}
            </div>
          ))}
        </div>

        <div className="border-t border-rule" />

        {/* Step content */}
        <div className="px-5 py-4 max-h-[400px] overflow-y-auto">
          {step === 0 && (
            <div>
              <div className="mb-3">
                <label className="text-[10px] uppercase tracking-wider text-ink3 block mb-1">Envelope name</label>
                <input
                  value={envelopeName}
                  onChange={e => setEnvelopeName(e.target.value)}
                  className="w-full border border-rule rounded-lg px-3 py-2 text-[12px] text-navy outline-none focus:border-rust"
                />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-ink3 mb-2">Select documents to include</p>
              <div className="bg-white border border-rule rounded-xl px-3">
                {docs.map(doc => (
                  <DocCheckbox key={doc.id} doc={doc} selected={selectedDocs.has(doc.id)} onToggle={toggleDoc} />
                ))}
              </div>
              {docs.length === 0 && (
                <p className="text-[12px] text-ink3 text-center py-6">No documents on this transaction yet.</p>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="grid grid-cols-3 gap-2 mb-1.5">
                {['Name', 'Email', 'Role'].map(h => (
                  <p key={h} className="text-[10px] uppercase tracking-wider text-ink3">{h}</p>
                ))}
              </div>
              <div className="bg-white border border-rule rounded-xl px-3">
                {signers.map(s => (
                  <SignerRow key={s.id} signer={s} onRemove={removeSigner} onChange={changeSigner} />
                ))}
              </div>
              <button
                onClick={addSigner}
                className="mt-2 flex items-center gap-1.5 text-[11px] text-rust hover:text-[#B33D24] transition-colors"
              >
                <Plus size={13} /> Add signer
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-ink3 mb-1.5">Message to signers (optional)</p>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Please review and sign at your earliest convenience…"
                  rows={3}
                  className="w-full border border-rule rounded-lg px-3 py-2 text-[12px] text-navy outline-none focus:border-rust resize-none"
                />
              </div>
              <div className="bg-ui-bg rounded-xl p-3 space-y-2">
                <p className="text-[11px] font-semibold text-navy">Summary</p>
                <p className="text-[11px] text-ink3">
                  <span className="text-navy">{selectedDocs.size} document{selectedDocs.size !== 1 ? 's' : ''}</span> · {signers.length} signer{signers.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-0.5">
                  {signers.map(s => (
                    <p key={s.id} className="text-[11px] text-ink3">
                      {s.name} <span className="text-ink3/60">({s.role})</span> — {s.email}
                    </p>
                  ))}
                </div>
                <p className="text-[10px] text-ink3 pt-1 border-t border-rule mt-2">
                  Signers will receive an email from DocuSeal with a secure signing link.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-rule px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : handleClose()}
            className="px-3 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors"
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] rounded-md text-white transition-colors ${
                (step === 0 ? canProceedStep0 : canProceedStep1)
                  ? 'bg-navy hover:bg-[#151D2D]'
                  : 'bg-rule text-ink3 cursor-not-allowed'
              }`}
            >
              Next <ChevronRight size={13} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] bg-rust text-white rounded-md hover:bg-[#B33D24] transition-colors"
            >
              Send envelope
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
