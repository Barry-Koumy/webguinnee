import { useState } from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import { useToast } from '../../hooks/useToast.jsx'
import { eras } from '../../data/chronologie.js'
import TimelineEra from './TimelineEra.jsx'
import './Chronologie.css'

export default function Chronologie() {
  const { showToast, ToastEl } = useToast()
  const [open, setOpen] = useState(0)

  return (
    <Layout
      active="/chronologie"
      eyebrow="Parcours historique"
      title="La <em>chronologie</em> guinéenne"
      sub="Des grands empires à la Guinée moderne — les jalons qui ont façonné la nation."
      toastEl={ToastEl}
    >
      <div className="p-chrono">
        <div className="timeline">
          {eras.map((era, i) => (
            <TimelineEra
              key={era.titre}
              era={era}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
              onEvent={(e) => showToast('📖 ' + e.date)}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
