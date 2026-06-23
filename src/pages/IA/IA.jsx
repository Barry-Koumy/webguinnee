import { useState } from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import { useToast } from '../../hooks/useToast.jsx'
import { iaSuggestions, iaIntro, iaReponseStub } from '../../data/ia.js'
import ChatMessage from './ChatMessage.jsx'
import ChatComposer from './ChatComposer.jsx'
import './IA.css'

export default function IA() {
  const { showToast, ToastEl } = useToast()
  const [messages, setMessages] = useState([iaIntro])
  const [input, setInput] = useState('')

  const send = (text) => {
    const q = (text ?? input).trim()
    if (!q) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    showToast('✨ Réponse en préparation...')
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ia', text: iaReponseStub }])
    }, 600)
  }

  return (
    <Layout
      active="/ia"
      eyebrow="Assistant"
      title="L'<em>assistant</em> WebGuinée"
      sub="Interrogez la mémoire de la Guinée en langage naturel."
      toastEl={ToastEl}
    >
      <div className="p-ia">
        <div className="ia-chat">
          {messages.map((m, i) => (
            <ChatMessage key={i} message={m} />
          ))}
        </div>

        {messages.length <= 1 && (
          <div className="ia-suggestions">
            {iaSuggestions.map((s) => (
              <button key={s} className="ia-sugg" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}

        <ChatComposer value={input} onChange={setInput} onSend={() => send()} />
      </div>
    </Layout>
  )
}
