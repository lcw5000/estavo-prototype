// Estavo Prototype — SigningExperienceModal
// Simulates the DocuSeal embedded signing experience
import { useState, useRef, useEffect, useCallback } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { Check, PenLine, Type, X } from 'lucide-react'

const DOC_LINES = [
  { w: '85%' }, { w: '92%' }, { w: '78%' }, { w: '88%' }, { w: '60%' },
  null,
  { w: '90%' }, { w: '95%' }, { w: '82%' }, { w: '70%' },
  null,
  { w: '88%' }, { w: '75%' }, { w: '93%' }, { w: '65%' }, { w: '80%' },
  null,
  { w: '91%' }, { w: '72%' }, { w: '88%' },
]

function SignaturePad({ onApply, onCancel }) {
  const canvasRef = useRef(null)
  const [tab, setTab] = useState('draw')
  const [typedName, setTypedName] = useState('')
  const [hasDrawing, setHasDrawing] = useState(false)
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    const ctx = canvas.getContext('2d')
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  }, [tab])

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  function startDraw(e) {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    drawing.current = true
  }

  function onDraw(e) {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#1D2535'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    setHasDrawing(true)
  }

  function endDraw(e) {
    e.preventDefault()
    drawing.current = false
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawing(false)
  }

  const canApply = tab === 'draw' ? hasDrawing : typedName.trim().length > 0

  return (
    <div className="border border-rule rounded-xl bg-white shadow-lg p-4 space-y-3">
      <div className="flex gap-1 bg-ui-bg rounded-lg p-0.5 w-fit">
        {[{ id: 'draw', icon: PenLine, label: 'Draw' }, { id: 'type', icon: Type, label: 'Type' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
              tab === t.id ? 'bg-white text-navy shadow-sm' : 'text-ink3 hover:text-navy'
            }`}
          >
            <t.icon size={11} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'draw' ? (
        <div>
          <p className="text-[10px] text-ink3 mb-1.5">Draw your signature below</p>
          <canvas
            ref={canvasRef}
            className="border border-dashed border-rule rounded-lg w-full h-[100px] cursor-crosshair touch-none"
            onMouseDown={startDraw}
            onMouseMove={onDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={onDraw}
            onTouchEnd={endDraw}
          />
          {hasDrawing && (
            <button onClick={clearCanvas} className="text-[10px] text-ink3 hover:text-navy mt-1">
              Clear
            </button>
          )}
        </div>
      ) : (
        <div>
          <p className="text-[10px] text-ink3 mb-1.5">Type your full name</p>
          <input
            autoFocus
            value={typedName}
            onChange={e => setTypedName(e.target.value)}
            placeholder="James Park"
            className="w-full border border-rule rounded-lg px-3 py-2 text-[18px] font-['Georgia',serif] text-navy outline-none focus:border-rust"
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="px-3 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg">
          Cancel
        </button>
        <button
          onClick={() => canApply && onApply(tab === 'type' ? typedName : 'drawn')}
          disabled={!canApply}
          className={`px-4 py-1.5 text-[11px] rounded-md text-white transition-colors ${
            canApply ? 'bg-rust hover:bg-[#B33D24]' : 'bg-rule text-ink3 cursor-not-allowed'
          }`}
        >
          Apply signature
        </button>
      </div>
    </div>
  )
}

function DocumentPreview({ fields, signatures, activeField, onFieldClick }) {
  return (
    <div className="bg-[#F5F3F0] rounded-lg p-6 overflow-y-auto max-h-[420px]">
      <div className="bg-white rounded shadow-sm px-8 py-7 max-w-2xl mx-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink3 mb-1">Home Inspection Report</p>
        <p className="text-[10px] text-ink3 mb-4">14 Oak Street, San Francisco CA 94110 · April 28, 2026</p>
        <div className="h-px bg-rule mb-5" />

        <div className="space-y-1.5 mb-6">
          {DOC_LINES.map((line, i) =>
            line === null ? (
              <div key={i} className="h-2" />
            ) : (
              <div key={i} className="h-2.5 bg-[#E8E6E2] rounded-full" style={{ width: line.w }} />
            )
          )}
        </div>

        {fields.map(field => {
          const signed = signatures[field.id]
          return (
            <div key={field.id} className="mb-3">
              <p className="text-[9px] uppercase tracking-wider text-ink3 mb-1">{field.label}</p>
              {signed ? (
                <div className="border border-teal/40 bg-[#EEF6F2] rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <Check size={13} className="text-teal shrink-0" />
                  <span className={`text-navy ${signed === 'drawn' ? 'text-[18px] font-["Georgia",serif] italic' : 'text-[18px] font-["Georgia",serif] italic'}`}>
                    {signed === 'drawn' ? '~ ' + field.signerName : signed}
                  </span>
                  <span className="text-[10px] text-teal ml-auto">Signed</span>
                </div>
              ) : (
                <button
                  onClick={() => onFieldClick(field.id)}
                  className={`w-full text-left border-2 border-dashed rounded-lg px-4 py-3 transition-all ${
                    activeField === field.id
                      ? 'border-rust bg-[#FEF0EE]'
                      : 'border-gold/60 bg-[#FFFBF0] hover:border-gold hover:bg-[#FFF8E0]'
                  }`}
                >
                  <p className="text-[11px] text-[#9A6A10]">
                    {activeField === field.id ? '↓ Sign below ↓' : '✎  Click to sign'}
                  </p>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function SigningExperienceModal({ open, onOpenChange, envelopeName, onComplete }) {
  const FIELDS = [
    { id: 'f1', label: 'Your signature', signerName: 'Lee' },
    { id: 'f2', label: 'Agent acknowledgement', signerName: 'Lee' },
  ]

  const [signatures, setSignatures] = useState({})
  const [activeField, setActiveField] = useState(null)
  const [done, setDone] = useState(false)

  const signedCount = Object.keys(signatures).length
  const total = FIELDS.length
  const allSigned = signedCount === total

  function handleApply(sig) {
    setSignatures(prev => ({ ...prev, [activeField]: sig }))
    setActiveField(null)
    if (signedCount + 1 === total) {
      setTimeout(() => setDone(true), 300)
    }
  }

  function handleFinish() {
    onComplete?.()
    onOpenChange(false)
    setSignatures({})
    setActiveField(null)
    setDone(false)
  }

  function handleClose() {
    onOpenChange(false)
    setSignatures({})
    setActiveField(null)
    setDone(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]" showCloseButton={false}>
        {/* Header */}
        <div className="bg-white border-b border-rule px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-navy rounded flex items-center justify-center">
                <PenLine size={11} className="text-white" />
              </div>
              <span className="text-[12px] font-semibold text-navy">DocuSeal</span>
            </div>
            <span className="text-[10px] text-ink3">· powered by Estavo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-ink3">
              {signedCount} of {total} fields signed
            </span>
            <div className="w-20 h-1.5 bg-rule rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all"
                style={{ width: `${(signedCount / total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {done ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 bg-[#EEF6F2] rounded-full flex items-center justify-center">
                <Check size={32} className="text-teal" />
              </div>
              <div className="text-center">
                <p className="text-[15px] font-semibold text-navy mb-1">All fields signed</p>
                <p className="text-[12px] text-ink3">A copy will be emailed to all parties.</p>
              </div>
              <button
                onClick={handleFinish}
                className="px-6 py-2 bg-rust text-white text-[12px] font-medium rounded-lg hover:bg-[#B33D24] transition-colors"
              >
                Finish & submit
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="text-[12px] font-semibold text-navy mb-0.5">{envelopeName}</p>
                <p className="text-[11px] text-ink3">Click each highlighted field to add your signature.</p>
              </div>

              <DocumentPreview
                fields={FIELDS}
                signatures={signatures}
                activeField={activeField}
                onFieldClick={id => setActiveField(prev => prev === id ? null : id)}
              />

              {activeField && (
                <SignaturePad
                  onApply={handleApply}
                  onCancel={() => setActiveField(null)}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
