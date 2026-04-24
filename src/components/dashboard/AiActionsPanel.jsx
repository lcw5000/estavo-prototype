// Estavo Prototype — AiActionsPanel
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { aiSuggestions } from '../../data/mockData'

function usePanelBounds(containerRef) {
  const [bounds, setBounds] = useState(null)

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect()
        setBounds({ left: r.left, width: r.width })
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    ro.observe(document.documentElement)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [containerRef])

  return bounds
}

export default function AiActionsPanel({ containerRef }) {
  const navigate = useNavigate()
  const [minimized, setMinimized] = useState(false)
  const suggestions = aiSuggestions.slice(0, 3)
  const bounds = usePanelBounds(containerRef)

  function handleAction(s) {
    if (s.actionType === 'draft') navigate(`/contacts/${s.contactId}?draft=true`)
    else navigate(`/contacts/${s.contactId}`)
  }

  const panelStyle = bounds
    ? { left: bounds.left, width: bounds.width }
    : { right: 16, width: 320 }

  const bg = 'linear-gradient(135deg, #1D2535 0%, #232D42 100%)'

  if (minimized) {
    return (
      <div
        className="fixed bottom-0 z-30 flex items-center justify-end"
        style={panelStyle}
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-tl-lg cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: bg }}
          onClick={() => setMinimized(false)}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">✦ Estavo AI</span>
          <ChevronUp size={12} className="text-gold" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-0 z-30 rounded-t-xl overflow-hidden shadow-2xl"
      style={{ ...panelStyle, background: bg }}
    >
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">
          ✦ Estavo AI — suggested actions
        </p>
        <button
          onClick={() => setMinimized(true)}
          className="text-white/40 hover:text-white/80 transition-colors p-0.5"
          aria-label="Minimize"
        >
          <ChevronDown size={13} />
        </button>
      </div>

      <div className="px-2 pb-3 space-y-1.5">
        {suggestions.map(s => (
          <div key={s.id} className="bg-white/5 border border-white/10 rounded-md p-2.5">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-[13px] leading-none shrink-0 mt-px">{s.icon}</span>
              <p className="text-[11px] font-semibold text-[#E8E4DC] flex-1 leading-tight">{s.title}</p>
              <button
                onClick={() => handleAction(s)}
                className={`text-[9px] font-semibold px-2 py-1 rounded-sm text-white shrink-0 hover:opacity-80 transition-opacity ${
                  s.actionType === 'draft' ? 'bg-gold' : 'bg-rust'
                }`}
              >
                {s.action}
              </button>
            </div>
            <p className="text-[10px] text-[#C8C4BC] leading-relaxed pl-5">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
