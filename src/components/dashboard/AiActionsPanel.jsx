// Estavo Prototype — AiActionsPanel
import { useNavigate } from 'react-router-dom'
import { aiSuggestions } from '../../data/mockData'

export default function AiActionsPanel({ mobile = false }) {
  const navigate = useNavigate()

  function handleAction(s) {
    if (s.actionType === 'draft') navigate(`/contacts/${s.contactId}?draft=true`)
    else navigate(`/contacts/${s.contactId}`)
  }

  return (
    <div className={mobile ? 'space-y-1.5' : 'flex flex-col min-h-0 h-full bg-white border border-rule rounded-xl overflow-hidden'}>
      {!mobile && (
        <div className="px-3 pt-3 pb-2 shrink-0 border-b border-rule">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">
            ✦ Estavo AI — suggested actions
          </p>
        </div>
      )}

      <div className={mobile ? 'space-y-1.5' : 'flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-1.5'}>
        {aiSuggestions.map(s => (
          <div key={s.id} className="bg-ui-bg border border-rule rounded-md p-2.5">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-[13px] leading-none shrink-0 mt-px">{s.icon}</span>
              <p className="text-[11px] font-semibold text-navy flex-1 leading-tight">{s.title}</p>
              <button
                onClick={() => handleAction(s)}
                className={`text-[9px] font-semibold px-2 py-1 rounded-sm text-white shrink-0 hover:opacity-80 transition-opacity ${
                  s.actionType === 'draft' ? 'bg-gold' : 'bg-rust'
                }`}
              >
                {s.action}
              </button>
            </div>
            <p className="text-[10px] text-ink3 leading-relaxed pl-5">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
