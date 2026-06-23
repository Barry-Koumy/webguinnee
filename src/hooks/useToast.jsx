import { useState, useRef, useCallback } from 'react'

// Toast réutilisable : retourne la fonction showToast et l'élément à monter.
export function useToast() {
  const [msg, setMsg] = useState('')
  const [show, setShow] = useState(false)
  const timer = useRef(null)

  const showToast = useCallback((text) => {
    setMsg(text)
    setShow(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setShow(false), 2700)
  }, [])

  const ToastEl = (
    <div className={'toast' + (show ? ' show' : '')}>{msg}</div>
  )

  return { showToast, ToastEl }
}
