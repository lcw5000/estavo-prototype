// Estavo Prototype — TransactionTimeline
export default function TransactionTimeline({ milestones }) {
  return (
    <div className="bg-white rounded-xl border border-rule p-4">
      <p className="text-[12px] font-semibold text-navy mb-4">📍 Transaction timeline</p>
      <div>
        {milestones.map((ms, i) => {
          const isLast = i === milestones.length - 1
          const isDone    = ms.status === 'done'
          const isCurrent = ms.status === 'current'

          return (
            <div key={ms.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5"
                  style={{
                    backgroundColor: isDone ? '#1A5C4A' : isCurrent ? '#C84B2F' : 'transparent',
                    border: isDone || isCurrent ? 'none' : '1.5px solid #CCC',
                    boxShadow: isCurrent ? '0 0 0 3px rgba(200,75,47,0.15)' : undefined,
                  }}
                />
                {!isLast && <div className="w-px h-5 bg-rule mt-0.5" />}
              </div>
              <div className="pb-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-[12px] ${isDone ? 'text-navy' : isCurrent ? 'text-rust font-medium' : 'text-ink3'}`}>
                    {ms.name}
                  </p>
                  {isDone && (
                    <span className="text-[9px] font-semibold bg-[#E6F4EE] text-teal px-1.5 py-0.5 rounded">Done</span>
                  )}
                  {isCurrent && (
                    <span className="text-[9px] font-semibold bg-[#FDF0EE] text-rust px-1.5 py-0.5 rounded">In progress</span>
                  )}
                </div>
                <p className="text-[10px] text-ink3">{ms.date}</p>
                {ms.detail && <p className="text-[10px] text-[#6A8A9A] mt-0.5">{ms.detail}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
