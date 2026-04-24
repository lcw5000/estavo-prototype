// Estavo Prototype — StepCard

const TYPE_CHIP = {
  email:         { label: 'Email',         cls: 'bg-[#EEF2FC] text-[#2B4FA0]' },
  sms:           { label: 'SMS',           cls: 'bg-[#E6F4EE] text-teal' },
  market_report: { label: 'Market report', cls: 'bg-[#FEF3E2] text-[#9A6A10]' },
}

function StatPill({ label, value }) {
  return (
    <span className="text-[9px]">
      <span className="text-ink3">{label} </span>
      <span className="font-semibold text-navy">{value}</span>
    </span>
  )
}

export default function StepCard({ step, index, isLast, isExpanded, onToggle }) {
  const chip = TYPE_CHIP[step.type] ?? { label: step.type, cls: 'bg-ui-bg text-slate' }
  const circleStyle = step.aiGenerated
    ? 'border-gold text-gold'
    : 'border-rule text-ink3'
  const stats = step.stats ?? {}

  return (
    <div className="flex gap-3 mb-2">
      {/* Connector */}
      <div className="flex flex-col items-center">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-semibold shrink-0 bg-white ${circleStyle}`}>
          {index + 1}
        </div>
        {!isLast && <div className="w-px flex-1 bg-rule mt-1 min-h-[16px]" />}
      </div>

      {/* Card */}
      <div
        className="flex-1 bg-white border border-rule rounded-lg p-2.5 mb-1 cursor-pointer hover:border-[#D0C8C0] transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${chip.cls}`}>
            {chip.label}
          </span>
          <span className="text-[10px] text-ink3">{step.timing}</span>
          {step.aiGenerated && (
            <span className="ml-auto text-[8px] font-semibold bg-[#FFF3E8] text-[#B54A1A] px-1 py-0.5 rounded">
              ✦ AI
            </span>
          )}
        </div>

        <p className="text-[11px] font-medium text-navy mb-0.5">{step.subject}</p>
        <p className={`text-[10px] text-ink3 ${isExpanded ? '' : 'line-clamp-1'}`}>
          {step.preview}
        </p>

        {Object.keys(stats).length > 0 && (
          <div className="flex gap-3 mt-1.5 pt-1.5 border-t border-[#F5F5F5]">
            {stats.open      != null && <StatPill label="Open"      value={`${stats.open}%`} />}
            {stats.click     != null && <StatPill label="Click"     value={`${stats.click}%`} />}
            {stats.reply     != null && <StatPill label="Reply"     value={`${stats.reply}%`} />}
            {stats.delivered != null && <StatPill label="Delivered" value={`${stats.delivered}%`} />}
          </div>
        )}
      </div>
    </div>
  )
}
