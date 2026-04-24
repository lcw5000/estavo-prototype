// Estavo Prototype — TransactionCard
import { useNavigate } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

function stageStyle(stage) {
  if (['pre-offer', 'offer'].includes(stage))        return 'bg-[#EEF2FC] text-[#2B4FA0]'
  if (['inspection', 'contingency'].includes(stage)) return 'bg-[#FEF8EC] text-[#9A6A10]'
  if (stage === 'clear_to_close')                    return 'bg-[#FFF3E8] text-[#B54A1A]'
  if (stage === 'closed')                            return 'bg-[#EEF6F2] text-[#1A5C4A]'
  return 'bg-[#F5F5F5] text-[#8A8A8A]'
}

function riskColor(level) {
  if (level === 'red')   return '#C84B2F'
  if (level === 'amber') return '#C49A3C'
  return '#1A5C4A'
}

function daysColor(days) {
  if (days == null) return 'text-[#8A8A8A]'
  if (days < 7)    return 'text-rust'
  if (days <= 14)  return 'text-gold'
  return 'text-teal'
}

function stageLabel(stage) {
  return stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function TransactionCard({ transaction: tx }) {
  const navigate = useNavigate()

  const docsComplete = tx.documents.filter(d => ['signed', 'received'].includes(d.status)).length
  const docsTotal = tx.documents.length

  const urgentAi = tx.aiMonitor.find(a => ['deadline', 'risk'].includes(a.type))
  const nextAction = urgentAi
    ? `✦ ${urgentAi.message.slice(0, 60)}${urgentAi.message.length > 60 ? '…' : ''}`
    : 'No urgent actions'

  const buyer = tx.parties.buyer?.name ?? '—'

  return (
    <div
      onClick={() => navigate(`/transactions/${tx.id}`)}
      className="bg-white rounded-xl border border-rule p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-navy truncate">{tx.address}</p>
          <p className="text-[11px] text-[#8A8A8A]">{tx.city}, {tx.state}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-2 h-2 rounded-full cursor-help"
                  style={{ backgroundColor: riskColor(tx.riskLevel) }} />
              </TooltipTrigger>
              {tx.riskReason && (
                <TooltipContent side="left" className="max-w-[200px] text-[11px]">
                  {tx.riskReason}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${stageStyle(tx.stage)}`}>
            {stageLabel(tx.stage)}
          </span>
        </div>
      </div>

      {/* Middle row */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2B4FA0] flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
            {buyer.split(' ').map(w => w[0]).slice(0, 2).join('')}
          </div>
          <p className="text-[12px] text-navy">{buyer}</p>
        </div>
        <p className={`text-[11px] font-medium ${daysColor(tx.daysToClose)}`}>
          {tx.daysToClose != null ? `${tx.daysToClose} days to close` : 'Closing TBD'}
        </p>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F5F5]">
        <p className={`text-[10px] rounded px-2 py-0.5 max-w-[60%] truncate ${
          urgentAi ? 'bg-[#FFF3E8] text-[#B54A1A]' : 'text-[#8A8A8A]'
        }`}>
          {nextAction}
        </p>
        <p className="text-[10px] text-[#8A8A8A] shrink-0">{docsComplete}/{docsTotal} docs complete</p>
      </div>
    </div>
  )
}
