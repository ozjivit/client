import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const slides = [
  new URL('../assets/pictur/1.jpg', import.meta.url).href,
  new URL('../assets/pictur/2.jpg', import.meta.url).href,
  new URL('../assets/pictur/3.jpg', import.meta.url).href,
  new URL('../assets/pictur/4.jpg', import.meta.url).href,
  new URL('../assets/pictur/5.jpg', import.meta.url).href,
  new URL('../assets/pictur/6.jpg', import.meta.url).href,
  new URL('../assets/pictur/7.jpg', import.meta.url).href,
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length)
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length)
  }

  return (
    <section className="hero-min" aria-label="Featured banner">
      <div className="hero-min-copy">
        <div className="hero-badge">New arrivals</div>
        <h1 className="hero-min-title">Beauty, simplified.</h1>
        <p className="hero-min-sub">Everyday essentials curated for your routine.</p>
        <div className="hero-actions">
          <Link to="/shop" className="btn primary">Shop now</Link>
          <Link to="/contact" className="btn ghost">Contact us</Link>
        </div>
      </div>
      <div className="hero-min-media" aria-hidden="true">
        <div className="hero-slider">
          {slides.map((src, i) => (
            <img key={i} src={src} alt="" className={`slide ${i === index ? 'active' : ''}`} />
          ))}
          <button className="slider-btn prev" aria-label="Previous" onClick={prev}>
            ‹
          </button>
          <button className="slider-btn next" aria-label="Next" onClick={next}>
            ›
          </button>
        </div>
      </div>
    </section>
  )
}