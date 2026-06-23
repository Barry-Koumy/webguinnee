// Bulle de message du chat (utilisateur ou IA)
export default function ChatMessage({ message }) {
  return (
    <div className={'ia-msg ' + message.role}>
      {message.role === 'ia' && <div className="ia-bubble-avatar">✨</div>}
      <div className="ia-bubble">{message.text}</div>
    </div>
  )
}
