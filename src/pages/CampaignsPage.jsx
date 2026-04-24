// Estavo Prototype — CampaignsPage
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { campaigns } from '../data/mockData'
import CampaignList from '../components/campaigns/CampaignList'
import DripSequence from '../components/campaigns/DripSequence'
import NewCampaignModal from '../components/campaigns/NewCampaignModal'

export default function CampaignsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const showNewModal = params.get('new') === 'true'

  const selected = id
    ? (campaigns.find(c => c.id === id) ?? campaigns[0])
    : campaigns[0]

  return (
    <div className="flex h-[calc(100vh_-_52px)] overflow-hidden">
      <CampaignList
        campaigns={campaigns}
        selectedId={selected?.id}
        onSelect={cid => navigate(`/campaigns/${cid}`)}
      />
      {selected && <DripSequence campaign={selected} />}

      <NewCampaignModal
        open={showNewModal}
        onClose={() => navigate('/campaigns')}
      />
    </div>
  )
}
