// Estavo Prototype — PropertyDetailsCard
import { properties } from '../../data/mockData'

export default function PropertyDetailsCard({ transaction, agent }) {
  const property = properties.find(p => p.id === transaction.propertyId)

  return (
    <div className="bg-white rounded-xl border border-rule p-4">
      <p className="text-[12px] font-semibold text-navy mb-3 leading-tight">{transaction.address}</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-ui-bg rounded-lg p-2 text-center">
          <p className="text-[15px] font-semibold text-navy leading-tight">
            ${(transaction.purchasePrice / 1000).toFixed(0)}K
          </p>
          <p className="text-[9px] text-ink3 mt-0.5">Purchase price</p>
        </div>
        <div className="bg-ui-bg rounded-lg p-2 text-center">
          <p className="text-[15px] font-semibold text-navy leading-tight">
            {property ? `${property.beds}bd / ${property.baths}ba` : '—'}
          </p>
          <p className="text-[9px] text-ink3 mt-0.5">Bed / Bath</p>
        </div>
      </div>
      <p className="text-[11px] text-ink3 text-center">{agent.phone}</p>
    </div>
  )
}
