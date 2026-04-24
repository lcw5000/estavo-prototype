// Estavo Prototype — DripSequence
import { useState } from 'react'
import StepCard from './StepCard'

const STATUS_BADGE = {
  active: { label: 'Active', cls: 'bg-[#E6F4EE] text-teal' },
  paused: { label: 'Paused', cls: 'bg-[#FEF3E2] text-[#9A6A10]' },
  draft:  { label: 'Draft',  cls: 'bg-[#F5F5F5] text-ink3' },
}

export default function DripSequence({ campaign }) {
  const [expandedId, setExpandedId] = useState(null)
  const badge = STATUS_BADGE[campaign.status] ?? STATUS_BADGE.draft

  return (
    <div className="flex-1 overflow-y-auto bg-paper p-4">
      {/* Campaign header */}
      <div className="bg-white border border-rule rounded-xl p-4 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[14px] font-semibold text-navy mb-1">{campaign.name}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-ink3">{campaign.contactCount} contacts</span>
              {campaign.avgOpenRate > 0 && (
                <>
                  <span className="text-ink3 text-[10px]">·</span>
                  <span className="text-[10px] text-ink3">{campaign.avgOpenRate}% open rate</span>
                </>
              )}
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="text-[11px] px-3 py-1.5 border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors">
              Edit
            </button>
            <button className="text-[11px] px-3 py-1.5 border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors">
              View stats
            </button>
          </div>
        </div>
      </div>

      {/* Sequence label */}
      <p className="text-[10px] uppercase tracking-wider text-ink3 mb-3">
        Sequence — ✦ AI generated · edited by you
      </p>

      {/* Steps */}
      <div>
        {campaign.steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            isLast={i === campaign.steps.length - 1}
            isExpanded={expandedId === step.id}
            onToggle={() => setExpandedId(expandedId === step.id ? null : step.id)}
          />
        ))}
      </div>
    </div>
  )
}
