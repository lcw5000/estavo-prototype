// Estavo Prototype — NewCampaignModal
import { useState } from 'react'
import { Loader, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[10px] font-medium text-navy block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const SEGMENTS = ['Buyers', 'Sellers', 'Sphere of influence', 'Past clients']
const TONES    = ['Casual', 'Professional', 'Warm and friendly']

export default function NewCampaignModal({ open, onClose }) {
  const [name, setName]       = useState('')
  const [segment, setSegment] = useState('')
  const [steps, setSteps]     = useState(5)
  const [tone, setTone]       = useState('')
  const [phase, setPhase]     = useState('idle') // idle | loading | success

  function handleGenerate() {
    setPhase('loading')
    setTimeout(() => setPhase('success'), 2000)
  }

  function handleClose() {
    setPhase('idle')
    setName(''); setSegment(''); setSteps(5); setTone('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[13px] font-semibold text-navy">
            Generate a new AI campaign
          </DialogTitle>
        </DialogHeader>

        {phase === 'idle' && (
          <div className="space-y-3">
            <Field label="Campaign name">
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Spring buyer nurture"
                className="w-full bg-ui-bg border border-rule rounded-md px-3 py-2 text-[11px] text-navy outline-none focus:ring-1 focus:ring-rule" />
            </Field>
            <Field label="Target segment">
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger className="text-[11px] h-9"><SelectValue placeholder="Select segment" /></SelectTrigger>
                <SelectContent>
                  {SEGMENTS.map(v => <SelectItem key={v} value={v} className="text-[11px]">{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label={`Number of steps — ${steps}`}>
              <input type="range" min={3} max={10} value={steps}
                onChange={e => setSteps(+e.target.value)}
                className="w-full accent-rust" />
            </Field>
            <Field label="Tone">
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="text-[11px] h-9"><SelectValue placeholder="Select tone" /></SelectTrigger>
                <SelectContent>
                  {TONES.map(v => <SelectItem key={v} value={v} className="text-[11px]">{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <button onClick={handleGenerate}
              className="w-full py-2.5 bg-rust text-white text-[11px] font-semibold rounded-md hover:bg-[#B33D24] transition-colors mt-1">
              ✦ Generate campaign →
            </button>
          </div>
        )}

        {phase === 'loading' && (
          <div className="flex flex-col items-center py-10 gap-3">
            <Loader size={24} className="text-rust animate-spin" />
            <p className="text-[11px] text-slate">Generating in your voice...</p>
          </div>
        )}

        {phase === 'success' && (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle size={36} className="text-teal" />
            <p className="text-[14px] font-semibold text-navy">Campaign created!</p>
            <p className="text-[11px] text-slate">{steps} steps generated in your voice.</p>
            <button onClick={handleClose}
              className="px-5 py-2 bg-rust text-white text-[11px] font-semibold rounded-md hover:bg-[#B33D24] mt-1">
              View campaign
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
