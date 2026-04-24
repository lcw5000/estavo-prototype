// Estavo Prototype — ShowingsPage
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { showings, contacts, properties } from '../data/mockData'
import ShowingCard from '../components/showings/ShowingCard'
import ScheduleShowingModal from '../components/showings/ScheduleShowingModal'

function enrich(showing) {
  const contact  = contacts.find(c => c.id === showing.contactId)
  const property = properties.find(p => p.id === showing.propertyId)
  return {
    ...showing,
    contactName:        contact?.name ?? 'Unknown',
    contactAvatar:      contact?.avatar ?? '?',
    contactAvatarColor: contact?.avatarColor ?? '#888',
    propertyPrice:      property?.price ?? null,
  }
}

const TODAY = new Date().toISOString().slice(0, 10)

export default function ShowingsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const showModal = params.get('schedule') === 'true'
  const [list, setList] = useState(() => showings.map(enrich))

  const active  = list.filter(s => s.status === 'confirmed' || s.status === 'pending')
  const todayS  = active.filter(s => s.date === TODAY)
  const comingS = active.filter(s => s.date !== TODAY)
  const past    = list.filter(s => s.status === 'completed')

  function confirm(id) {
    setList(prev => prev.map(s => s.id === id ? { ...s, status: 'confirmed' } : s))
  }

  function addShowing(showing) {
    setList(prev => [showing, ...prev])
  }

  return (
    <div className="space-y-5">
      {todayS.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider text-ink3">Today</span>
            <span className="text-[9px] font-semibold bg-rust text-white px-2 py-0.5 rounded-full">
              {todayS.length} showing{todayS.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-3">
            {todayS.map(s => (
              <ShowingCard key={s.id} showing={s} isToday onConfirm={() => confirm(s.id)} />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] uppercase tracking-wider text-ink3 mb-2">Coming up</p>
        {comingS.length ? (
          <div className="space-y-3">
            {comingS.map(s => <ShowingCard key={s.id} showing={s} onConfirm={() => confirm(s.id)} />)}
          </div>
        ) : (
          <p className="text-sub text-slate">No upcoming showings.</p>
        )}
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider text-ink3 mb-2">Past</p>
        <div className="space-y-3">
          {past.map(s => <ShowingCard key={s.id} showing={s} />)}
        </div>
      </div>

      <ScheduleShowingModal
        open={showModal}
        onClose={() => navigate('/showings')}
        onAdd={addShowing}
      />
    </div>
  )
}
