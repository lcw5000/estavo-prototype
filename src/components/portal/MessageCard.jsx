// Estavo Prototype — MessageCard
import { useState } from 'react'
import { Send } from 'lucide-react'

export default function MessageCard({ messages, agent }) {
  const [input, setInput] = useState('')
  const [sent, setSent]   = useState(false)

  function handleSend() {
    if (!input.trim()) return
    setSent(true)
    setInput('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="bg-white rounded-xl border border-rule p-4">
      <p className="text-[12px] font-semibold text-navy mb-3">💬 Message {agent.name}</p>

      <div className="space-y-2 mb-3">
        {messages.map(msg => (
          <div key={msg.id} className="bg-[#F5F9F5] rounded-lg p-2.5 border-l-2 border-teal">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-semibold text-navy">
                {msg.from === 'agent' ? agent.name : 'You'}
              </span>
              <span className="text-[10px] text-ink3">{msg.timestamp}</span>
            </div>
            <p className="text-[11px] text-[#4A4A4A] leading-relaxed">{msg.text}</p>
          </div>
        ))}
      </div>

      {sent && (
        <div className="bg-[#E6F4EE] rounded-lg p-2 mb-2">
          <p className="text-[11px] text-teal font-medium">Message sent ✓</p>
        </div>
      )}

      <div className="bg-ui-bg rounded-lg p-2.5 flex items-center gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={`Type a message to ${agent.name}...`}
          className="flex-1 bg-transparent text-[11px] text-navy placeholder:text-ink3 outline-none"
        />
        <button onClick={handleSend} className="text-rust hover:opacity-70 transition-opacity shrink-0">
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
