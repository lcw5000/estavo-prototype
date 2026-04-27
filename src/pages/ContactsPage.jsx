// Estavo Prototype — ContactsPage
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { contacts, aiSuggestions, interactions } from '../data/mockData'
import ContactList from '../components/crm/ContactList'
import ContactDetail from '../components/crm/ContactDetail'
import AiIntelPanel from '../components/crm/AiIntelPanel'

export default function ContactsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const autoDraft = searchParams.get('draft') === 'true'

  const selectedContact = id ? (contacts.find(c => c.id === id) ?? null) : null
  const suggestions = selectedContact
    ? aiSuggestions.filter(s => s.contactId === selectedContact.id)
    : []

  const onSelect = cid => navigate(`/contacts/${cid}`)

  return (
    <>
      {/* Mobile: one panel at a time */}
      <div className="md:hidden h-full flex flex-col overflow-hidden">
        {!id
          ? <ContactList contacts={contacts} selectedId={null} onSelect={onSelect} />
          : <ContactDetail contact={selectedContact} interactions={interactions} autoDraft={autoDraft} />
        }
      </div>

      {/* Desktop: three-panel layout */}
      <div className="hidden md:flex h-[calc(100vh_-_52px)] overflow-hidden">
        <ContactList contacts={contacts} selectedId={id ?? null} onSelect={onSelect} />
        <ContactDetail contact={selectedContact} interactions={interactions} autoDraft={autoDraft} />
        <AiIntelPanel contact={selectedContact} suggestions={suggestions} />
      </div>
    </>
  )
}
