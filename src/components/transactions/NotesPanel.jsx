// Estavo Prototype — NotesPanel
import { useState } from 'react'
import { Lock } from 'lucide-react'

export default function NotesPanel({ initialNotes }) {
  const [notes, setNotes] = useState(initialNotes)
  const [draft, setDraft] = useState('')

  function addNote() {
    if (!draft.trim()) return
    const now = new Date()
    const ts = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' · ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setNotes([{ id: `note-${Date.now()}`, text: draft.trim(), timestamp: ts }, ...notes])
    setDraft('')
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-4">
        <Lock size={11} className="text-ink3" />
        <p className="text-[10px] text-ink3 italic">Private — not visible to client</p>
      </div>

      {/* Add note */}
      <div className="mb-4">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Add a private note about this transaction…"
          rows={3}
          className="w-full text-[12px] text-navy bg-white border border-rule rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-rust/30 resize-none placeholder:text-ink3"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={addNote}
            disabled={!draft.trim()}
            className="text-[11px] bg-rust text-white rounded-md px-3 py-1.5 hover:bg-[#B33D24] transition-colors disabled:opacity-40"
          >
            Save note
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="space-y-2">
        {notes.map(note => (
          <div key={note.id} className="bg-white rounded-xl border border-rule p-3">
            <p className="text-[12px] text-navy leading-relaxed">{note.text}</p>
            <p className="text-[10px] text-ink3 mt-1.5">{note.timestamp}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-[12px] text-ink3 text-center py-6">No notes yet.</p>
        )}
      </div>
    </div>
  )
}
