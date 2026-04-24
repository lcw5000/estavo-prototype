// Estavo Prototype — ScheduleShowingModal
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { contacts } from '../../data/mockData'

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[10px] font-medium text-navy block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const INPUT = "w-full bg-ui-bg border border-rule rounded-md px-3 py-2 text-[11px] text-navy outline-none focus:ring-1 focus:ring-rule"

export default function ScheduleShowingModal({ open, onClose, onAdd }) {
  const [contactId, setContactId] = useState('')
  const [address, setAddress]     = useState('')
  const [date, setDate]           = useState('')
  const [time, setTime]           = useState('')
  const [notes, setNotes]         = useState('')

  function handleSubmit() {
    if (!contactId || !address || !date || !time) return
    const contact = contacts.find(c => c.id === contactId)
    onAdd({
      id: `showing-${Date.now()}`,
      contactId,
      address,
      date,
      time,
      status: 'pending',
      notes,
      contactName:        contact?.name ?? 'Unknown',
      contactAvatar:      contact?.avatar ?? '?',
      contactAvatarColor: contact?.avatarColor ?? '#888',
    })
    setContactId(''); setAddress(''); setDate(''); setTime(''); setNotes('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[13px] font-semibold text-navy">Schedule showing</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Contact">
            <Select value={contactId} onValueChange={setContactId}>
              <SelectTrigger className="text-[11px] h-9"><SelectValue placeholder="Select contact" /></SelectTrigger>
              <SelectContent>
                {contacts.map(c => (
                  <SelectItem key={c.id} value={c.id} className="text-[11px]">{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Property address">
            <input value={address} onChange={e => setAddress(e.target.value)}
              placeholder="123 Main St, San Francisco CA" className={INPUT} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Date">
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className={INPUT} />
            </Field>
            <Field label="Time">
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className={INPUT} />
            </Field>
          </div>
          <Field label="Notes">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Notes for the listing agent..."
              className={`${INPUT} resize-none`} />
          </Field>
          <button onClick={handleSubmit}
            className="w-full py-2.5 bg-teal text-white text-[11px] font-semibold rounded-md hover:opacity-90 transition-opacity">
            Confirm showing
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
