// Estavo Prototype — AiMonitorFeed
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'

const TYPE_CONFIG = {
  risk:     { icon: AlertTriangle, color: 'text-rust',       border: 'border-rust',  bg: 'bg-[#FDF5F3]', label: 'Risk' },
  deadline: { icon: Clock,         color: 'text-gold',       border: 'border-gold',  bg: 'bg-[#FFFBF0]', label: 'Deadline' },
  info:     { icon: CheckCircle,   color: 'text-teal',       border: 'border-teal',  bg: 'bg-[#F0F7F4]', label: 'Info' },
}

export default function AiMonitorFeed({ items }) {
  return (
    <div>
      <div className="mb-4">
        <p className="text-[13px] font-semibold text-navy">
          <span className="text-gold">✦</span> Estavo AI — Transaction intelligence
        </p>
        <p className="text-[11px] text-[#8A8A8A] mt-0.5">
          AI is monitoring your message threads and documents for this deal.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-ink3 gap-2">
          <span className="text-gold text-xl">✦</span>
          <p className="text-[12px]">No AI flags for this transaction.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => {
            const { icon: Icon, color, border, bg, label } = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.info
            return (
              <div key={item.id} className={`border-l-4 rounded-r-lg p-3 ${border} ${bg}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Icon size={12} className={color} />
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${color}`}>{label}</span>
                  </div>
                  <span className="text-[10px] text-ink3">{item.timestamp}</span>
                </div>
                <p className="text-[12px] text-navy leading-relaxed">{item.message}</p>
                <p className="text-[10px] text-[#8A8A8A] mt-1 italic">Source: {item.source}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
