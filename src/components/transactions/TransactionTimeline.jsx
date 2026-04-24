// Estavo Prototype — TransactionTimeline (agent view)
export default function TransactionTimeline({ milestones }) {
  return (
    <div className="space-y-0">
      {milestones.map((ms, i) => {
        const isLast = i === milestones.length - 1
        const isDone = ms.status === 'done'
        const isCurrent = ms.status === 'current'

        return (
          <div key={ms.id} className="flex gap-3">
            {/* Connector column */}
            <div className="flex flex-col items-center w-5 shrink-0">
              {/* Dot */}
              <div className={`relative mt-0.5 w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center ${
                isDone    ? 'bg-teal' :
                isCurrent ? 'bg-rust' :
                'border-2 border-[#D0C8BC] bg-white'
              }`}>
                {isDone && <span className="text-white text-[8px] leading-none">✓</span>}
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full bg-rust/30 animate-ping" />
                )}
              </div>
              {/* Line */}
              {!isLast && (
                <div className={`w-px flex-1 mt-1 ${
                  isDone    ? 'bg-teal' :
                  isCurrent ? 'bg-rust' :
                  'border-l border-dashed border-[#D0C8BC]'
                }`} style={{ minHeight: 24 }} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-4 flex-1 ${isLast ? '' : ''}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-[12px] font-medium ${
                  isDone ? 'text-navy' : isCurrent ? 'text-rust' : 'text-[#8A8A8A]'
                }`}>{ms.name}</p>
                {ms.date && ms.date !== 'TBD' && (
                  <span className="text-[10px] text-[#8A8A8A]">{ms.date}</span>
                )}
                {ms.date === 'TBD' && <span className="text-[10px] text-[#8A8A8A]">TBD</span>}
                {isDone && (
                  <span className="text-[9px] bg-[#EEF6F2] text-teal px-1.5 py-0.5 rounded-full font-medium">✓ Done</span>
                )}
                {isCurrent && (
                  <span className="text-[9px] bg-[#FDF0EE] text-rust px-1.5 py-0.5 rounded-full font-medium">In progress</span>
                )}
              </div>
              {ms.detail && (
                <p className="text-[11px] text-[#6A8A9A] mt-0.5">{ms.detail}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
