// Estavo Prototype — DocumentsCard
import { Download } from 'lucide-react'

const DOC_BADGE = {
  signed:  { label: 'Signed',  cls: 'bg-[#E6F4EE] text-teal' },
  review:  { label: 'Review',  cls: 'bg-[#EEF2FC] text-[#2B4FA0]' },
  pending: { label: 'Pending', cls: 'bg-[#FEF3E2] text-[#9A6A10]' },
}

export default function DocumentsCard({ documents }) {
  return (
    <div className="bg-white rounded-xl border border-rule p-4">
      <p className="text-[12px] font-semibold text-navy mb-3">📁 Documents</p>
      <div className="space-y-2.5">
        {documents.map(doc => {
          const badge = DOC_BADGE[doc.status] ?? DOC_BADGE.pending
          return (
            <div key={doc.id} className="flex items-center gap-2">
              <span className="text-[14px] shrink-0">📄</span>
              <span className="flex-1 text-[11px] text-navy">{doc.name}</span>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${badge.cls}`}>
                {badge.label}
              </span>
              <Download size={14} className="text-ink3 hover:text-navy cursor-pointer transition-colors shrink-0" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
