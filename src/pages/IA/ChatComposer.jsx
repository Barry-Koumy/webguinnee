// Champ de saisie + bouton d'envoi du chat
export default function ChatComposer({ value, onChange, onSend }) {
  return (
    <div className="ia-composer">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        placeholder="Posez votre question..."
      />
      <button className="ia-send" onClick={onSend} aria-label="Envoyer">➤</button>
    </div>
  )
}
