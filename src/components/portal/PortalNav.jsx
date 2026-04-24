// Estavo Prototype — PortalNav
export default function PortalNav({ address, agent, isAgentPreview, onBackToTransaction }) {
  return (
    <div className="bg-[#1A2A3A] py-3 px-6 flex items-center gap-4">
      <span className="font-display text-[16px] text-white shrink-0">
        Esta<span className="text-gold">v</span>o
      </span>
      <p className="flex-1 text-center text-[11px] text-[#6A8A9A] truncate">{address}</p>
      <div className="flex items-center gap-3 shrink-0">
        {isAgentPreview && (
          <button
            onClick={onBackToTransaction}
            className="text-[11px] text-gold hover:text-white transition-colors border border-gold/40 hover:border-white/40 rounded px-2.5 py-1"
          >
            ← Back to transaction
          </button>
        )}
        <span className="text-[11px] text-[#9AB4C4]">Your agent: {agent.name}</span>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
          style={{ backgroundColor: agent.avatarColor }}
        >
          {agent.avatar}
        </div>
      </div>
    </div>
  )
}
