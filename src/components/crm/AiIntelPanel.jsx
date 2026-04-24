// Estavo Prototype — AiIntelPanel
import { useNavigate } from 'react-router-dom'

const REASON_DOTS = ['#C84B2F', '#C49A3C', '#1A5C4A', '#6A6A9A']

export default function AiIntelPanel({ contact, suggestions }) {
  const navigate = useNavigate()
  if (!contact) return null

  return (
    <div className="w-[240px] shrink-0 bg-white border-l border-rule flex flex-col overflow-y-auto">
      {/* Score header */}
      <div className="p-4 text-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2a1a1a 100%)' }}>
        {contact.score != null ? (
          <>
            <p className="font-bold leading-none mb-1 text-rust" style={{ fontSize: '42px' }}>
              {contact.score}
            </p>
            <p className="text-[10px] text-[#888]">Lead Score</p>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full"
                style={{ width: `${contact.score}%`, background: 'linear-gradient(90deg, #C49A3C, #C84B2F)' }} />
            </div>
          </>
        ) : (
          <p className="text-[13px] font-semibold text-white">Under Contract</p>
        )}
      </div>

      {/* Score reasons */}
      {contact.scoreReason && (
        <div className="p-3 border-b border-rule">
          <p className="text-[11px] font-semibold text-navy mb-2">Why {contact.score}?</p>
          <div className="space-y-2">
            {contact.scoreReason.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: REASON_DOTS[i] ?? '#8A8A8A' }} />
                <p className="text-[10px] text-slate leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI summary */}
      {contact.aiSummary && (
        <div className="p-3 border-b border-rule">
          <p className="text-[11px] font-semibold text-navy mb-1.5">AI summary</p>
          <p className="text-[10px] text-slate leading-relaxed">{contact.aiSummary}</p>
        </div>
      )}

      {/* Suggested actions */}
      {suggestions.length > 0 && (
        <div className="p-3">
          <p className="text-[11px] font-semibold text-navy mb-2">Suggested actions</p>
          <div className="space-y-2">
            {suggestions.slice(0, 2).map(s => (
              <div key={s.id} className="bg-ui-bg rounded-lg p-2">
                <p className="text-[11px] font-semibold text-navy mb-1">{s.icon} {s.title}</p>
                <p className="text-[10px] text-slate leading-relaxed mb-2">{s.description}</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => s.type === 'schedule_showing'
                      ? navigate('/showings?schedule=true')
                      : navigate(`/contacts/${s.contactId}`)
                    }
                    className="text-[9px] font-semibold px-2 py-1 bg-rust text-white rounded-sm hover:opacity-80"
                  >
                    {s.action}
                  </button>
                  <button className="text-[9px] px-2 py-1 border border-rule rounded-sm text-slate hover:bg-white transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
