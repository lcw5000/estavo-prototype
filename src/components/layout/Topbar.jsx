// Estavo Prototype — Topbar
import { Search } from 'lucide-react'

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
})

export default function Topbar({ title, primaryLabel, onPrimary, ghostLabel, onGhost }) {
  return (
    <header className="h-topbar bg-white border-b border-rule flex items-center px-4 gap-4 shrink-0">
      {/* Page title */}
      <h1 className="text-page font-semibold text-navy w-36 shrink-0">{title}</h1>

      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search contacts, properties..."
            className="w-full bg-ui-bg rounded-md pl-8 pr-3 py-1.5 text-sub text-navy placeholder:text-ink3 outline-none focus:ring-1 focus:ring-rule transition-shadow"
          />
        </div>
      </div>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sub text-slate hidden lg:block select-none">{today}</span>

        {ghostLabel && (
          <button
            onClick={onGhost}
            className="px-3 py-1.5 text-sub text-slate border border-rule rounded-md hover:bg-ui-bg transition-colors"
          >
            {ghostLabel}
          </button>
        )}

        {primaryLabel && (
          <button
            onClick={onPrimary}
            className="px-3 py-1.5 text-sub text-white bg-rust rounded-md font-medium hover:bg-[#B33D24] transition-colors"
          >
            {primaryLabel}
          </button>
        )}
      </div>
    </header>
  )
}
