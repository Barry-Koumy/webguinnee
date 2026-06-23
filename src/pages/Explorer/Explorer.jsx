import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast.jsx'
import { categories } from '../../data/categories.js'
import ExplorerHeader from './sections/ExplorerHeader.jsx'
import PageHeader from './sections/PageHeader.jsx'
import FilterTabs from './sections/FilterTabs.jsx'
import QuickChips from './sections/QuickChips.jsx'
import FilterDrawer from './sections/FilterDrawer.jsx'
import FeatureDoc from './sections/FeatureDoc.jsx'
import Categories from './sections/Categories.jsx'
import Personnalites from './sections/Personnalites.jsx'
import RegionsMini from './sections/RegionsMini.jsx'
import Themes from './sections/Themes.jsx'
import DocumentsSection from './sections/DocumentsSection.jsx'
import RecitsExplorer from './sections/RecitsExplorer.jsx'
import BottomNav from './sections/BottomNav.jsx'
import './Explorer.css'

function toggleInSet(prev, label) {
  const next = new Set(prev)
  next.has(label) ? next.delete(label) : next.add(label)
  return next
}

// Sections visibles selon l'onglet actif
function visible(activeTab, section) {
  const map = {
    all:    ['feature', 'categories', 'perso', 'lieux', 'themes', 'docs'],
    docs:   ['feature', 'docs'],
    audio:  ['audio'],
    perso:  ['perso'],
    lieux:  ['lieux'],
    themes: ['themes', 'categories'],
  }
  return (map[activeTab] ?? map.all).includes(section)
}

export default function Explorer() {
  const { showToast, ToastEl } = useToast()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('all')
  const [chips, setChips] = useState(new Set(['✨ Récents']))
  const [view, setView] = useState('list')
  const [filterOpen, setFilterOpen] = useState(false)
  const [fchips, setFchips] = useState(new Set(['Toutes', 'XIXe siècle', '📄 PDF', 'Français']))
  const [search, setSearch] = useState('')

  const liveSearch = (val) => {
    setSearch(val)
    if (val.length > 2) showToast('🔍 ' + val + '...')
  }

  // Sélection d'un thème → ouvre la page dédiée /theme/:slug
  const selectTheme = (i) => navigate('/theme/' + categories[i].slug)

  // Sélection d'une région → ouvre la page dédiée /region/:slug
  const selectRegion = (r) => navigate('/region/' + r.slug)

  // Clic sur une personnalité → ouvre son 1er livre, sinon simple toast
  const selectPersonne = (p) => {
    if (p.livres?.[0]) navigate('/livre/' + p.livres[0])
    else showToast('👤 ' + p.nom)
  }

  const v = (section) => visible(activeTab, section)

  return (
    <div className="page-explorer">
      {ToastEl}

      <FilterDrawer
        open={filterOpen}
        selected={fchips}
        onToggle={(c) => setFchips((p) => toggleInSet(p, c))}
        onClose={() => setFilterOpen(false)}
        onReset={() => { setFilterOpen(false); showToast('🔄 Filtres réinitialisés') }}
        onApply={() => { setFilterOpen(false); showToast('✅ Filtres appliqués') }}
      />

      <ExplorerHeader onOpenFilter={() => setFilterOpen(true)} />
      <PageHeader search={search} onSearch={liveSearch} />
      <FilterTabs active={activeTab} onSelect={(t) => { setActiveTab(t.id); showToast('📂 ' + t.label) }} />
      <QuickChips
        selected={chips}
        onToggle={(c) => setChips((p) => toggleInSet(p, c))}
        onOpenFilter={() => setFilterOpen(true)}
      />

      <main className="main">
        {v('feature') && <FeatureDoc onToast={showToast} />}

        {v('categories') && (
          <Categories active={-1} onSelect={selectTheme} />
        )}

        {v('perso') && (
          <>
            <div className="spacer"></div>
            <Personnalites layout={activeTab === 'perso' ? 'list' : 'scroll'} onSelect={selectPersonne} />
          </>
        )}

        {v('lieux') && (
          <>
            <div className="spacer"></div>
            <RegionsMini onSelect={selectRegion} />
          </>
        )}

        {v('themes') && (
          <>
            <div className="spacer"></div>
            <Themes onSelect={(t) => showToast(t.icon + ' Thème : ' + t.nom)} />
          </>
        )}

        {v('audio') && (
          <RecitsExplorer onSelect={(r) => showToast('▶ ' + r.titre)} />
        )}

        {v('docs') && (
          <DocumentsSection
            view={view}
            onView={setView}
            onAction={(d) => (d.route ? navigate(d.route) : showToast(d.toast))}
            tabFilter={activeTab}
            activeChips={chips}
          />
        )}

        <div style={{ height: 24 }}></div>
      </main>

      <BottomNav />
    </div>
  )
}
