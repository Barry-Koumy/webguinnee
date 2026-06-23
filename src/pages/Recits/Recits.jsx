import { useState } from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import { useToast } from '../../hooks/useToast.jsx'
import { recits, filtresRecits } from '../../data/recits.js'
import RecitCard from './RecitCard.jsx'
import './Recits.css'

export default function Recits() {
  const { showToast, ToastEl } = useToast()
  const [filter, setFilter] = useState('Tous')
  const [playing, setPlaying] = useState(null)

  const list = filter === 'Tous'
    ? recits
    : recits.filter((r) => r.tag === filter || r.tag === filter.replace(/s$/, ''))

  const togglePlay = (titre) => {
    setPlaying((p) => (p === titre ? null : titre))
    if (playing !== titre) showToast('🎙️ Lecture en cours...')
  }

  return (
    <Layout
      active="/recits"
      eyebrow="Patrimoine oral"
      title="Les <em>récits</em> oraux"
      sub="L'histoire vit aussi dans les voix des anciens, des griots et des témoins."
      toastEl={ToastEl}
    >
      <div className="p-recits">
        <div className="r-filters">
          {filtresRecits.map((f) => (
            <span key={f} className={'r-filter' + (filter === f ? ' on' : '')} onClick={() => setFilter(f)}>{f}</span>
          ))}
        </div>

        <div className="r-list">
          {list.map((r) => (
            <RecitCard key={r.titre} recit={r} playing={playing === r.titre} onToggle={() => togglePlay(r.titre)} />
          ))}
        </div>

        {list.length === 0 && <p className="r-none">Aucun récit dans cette catégorie pour le moment.</p>}
      </div>
    </Layout>
  )
}
