import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import localSlide3 from '../assets/pictur/5.jpg'

export default function HeroBanner() {
  const slides = useMemo(() => ([
    { id: 1, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop', title: 'NEW\nLOOK\nNEW\nROUTINE', tagline: 'A New Era of Beauty Begins' },
    { id: 2, image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1600&auto=format&fit=crop', title: 'SKIN\nCARE\nESSENTIALS', tagline: 'Radiance that starts today' },
    { id: 3, image: localSlide3, title: 'MAKEUP\nYOU\nLOVE', tagline: 'Express your best self' },
  ]), [])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    const id = setInterval(() => {
      setIndex((v) => (v + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <section className="hero" aria-label="Featured promotions">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`hero-slide ${i === index ? 'active' : ''}`}
          aria-hidden={i !== index}
        >
          <div className="hero-image">
            <img
              src={s.image}
              alt="Beauty banner"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding={i === 0 ? 'sync' : 'async'}
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa0?q=80&w=1600&auto=format&fit=crop' }}
            />
            <div className="hero-vignette" />
          </div>
          <div className="hero-content">
            <div className="hero-title" aria-live="polite">
              {s.title.split('\n').map((line, idx) => (
                <span key={idx}>{line}</span>
              ))}
            </div>
            <div className="hero-tagline">{s.tagline} <em>Act fast!</em></div>
            <Link to="/shop" className="btn primary">Shop Now</Link>
          </div>
        </div>
      ))}

      <div className="hero-dots" role="tablist" aria-label="Select banner slide">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}


