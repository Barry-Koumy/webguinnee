import { useEffect } from 'react'

// Ajoute la classe `visible` aux éléments `.fade-up` quand ils entrent dans le viewport.
// `deps` permet de ré-observer après l'apparition de nouvelles sections (ex. connexion).
export function useFadeUp(deps = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.fade-up:not(.visible)').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
