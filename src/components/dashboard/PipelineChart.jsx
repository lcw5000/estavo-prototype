// Estavo Prototype — PipelineChart
import { pipelineStages } from '../../data/mockData'

export default function PipelineChart() {
  const max = Math.max(...pipelineStages.map(s => s.count))

  return (
    <div className="bg-white border border-rule rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-semibold text-navy">Pipeline</p>
        <p className="text-[10px] text-ink3">51 total contacts</p>
      </div>

      <div className="space-y-2.5">
        {pipelineStages.map(stage => (
          <div key={stage.label} className="flex items-center gap-2">
            {/* Stage label */}
            <span className="text-[10px] text-slate w-[130px] shrink-0 truncate">
              {stage.label}
            </span>

            {/* Bar track */}
            <div className="flex-1 bg-ui-bg rounded h-[14px] overflow-hidden">
              <div
                className="h-full rounded transition-all"
                style={{
                  width: `${(stage.count / max) * 100}%`,
                  backgroundColor: stage.color,
                }}
              />
            </div>

            {/* Count */}
            <span className="text-[10px] text-slate w-5 text-right shrink-0">
              {stage.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
