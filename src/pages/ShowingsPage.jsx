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

export default function ShowingsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const showModal = params.get('schedule') === 'true'
  const [list, setList] = useState(() => showings.map(enrich))

  const upcoming = list.filter(s => s.status === 'confirmed' || s.status === 'pending')
  const past     = list.filter(s => s.status === 'completed')

  function confirm(id) {
    setList(prev => prev.map(s => s.id === id ? { ...s, status: 'confirmed' } : s))
  }

  function addShowing(showing) {
    setList(prev => [showing, ...prev])
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-ink3 mb-2">Upcoming</p>
        {upcoming.length ? (
          <div className="space-y-3">
            {upcoming.map(s => <ShowingCard key={s.id} showing={s} onConfirm={() => confirm(s.id)} />)}
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
