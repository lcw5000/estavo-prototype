// Estavo Prototype — KpiCard
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const TREND = {
  up:      { icon: TrendingUp,   cls: 'text-teal' },
  down:    { icon: TrendingDown, cls: 'text-rust' },
  neutral: { icon: Minus,        cls: 'text-ink3' },
}

export default function KpiCard({ label, value, delta, trend = 'neutral', onClick }) {
  const { icon: Icon, cls } = TREND[trend] ?? TREND.neutral
  return (
    <div
      className={`bg-white border border-rule rounded-xl p-4 ${onClick ? 'cursor-pointer hover:border-rust/40 transition-colors' : ''}`}
      onClick={onClick}
    >
      <p className="text-[10px] uppercase tracking-wider text-ink3 mb-1.5">{label}</p>
      <p className="text-[22px] font-semibold text-navy leading-none mb-2">{value}</p>
      <div className={`flex items-center gap-1 ${cls}`}>
        <Icon size={10} strokeWidth={2.5} />
        <span className="text-[10px]">{delta}</span>
      </div>
    </div>
  )
}
