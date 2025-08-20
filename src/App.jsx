import './App.css'
import { useEffect, useState } from 'react'
import { fetchProducts as fetchProductsApi } from './api'
import { Link } from 'react-router-dom'
import { useAuth } from './state/AuthContext.jsx'
import { useUi } from './state/UiContext.jsx'
import { useWishlist } from './state/WishlistContext.jsx'
import HeroBanner from './components/HeroBanner.jsx'

import { useCart } from './state/CartContext.jsx'
import cat1 from './assets/category/1.jpg'
import cat2 from './assets/category/2.jpg'
import cat3 from './assets/category/3.jpg'
import cat4 from './assets/category/4.jpg'
import cat5 from './assets/category/5.jpg'
import promoImg from './assets/pictur/1.jpg'
import promoFallback from './assets/pictur/2.jpg'
// Only 1-5 exist in assets/category

const categories = [
  { name: 'Honest Glow', img: cat1 },
  { name: 'Doctor Alvim', img: cat2 },
  { name: 'Beauty Quality', img: cat3 },
  { name: 'B', img: cat4 },
  { name: 'Brilliant Sky', img: cat5 },
]

const fallbackProducts = [
  { name: 'Hydrating Face Cream', price: 18.0, rating: 5, img: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600&auto=format&fit=crop' },
  { name: 'Revitalizing Serum', price: 30.0, rating: 4, img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa0?q=80&w=600&auto=format&fit=crop' },
  { name: 'Matte Lipstick', price: 18.0, rating: 5, img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop' },
  { name: 'Blush Palette', price: 24.0, rating: 5, img: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?q=80&w=600&auto=format&fit=crop' },
  { name: 'Scented Body Oil', price: 29.0, rating: 4, img: 'https://images.unsplash.com/photo-1556228453-efd1a8e6dfcf?q=80&w=600&auto=format&fit=crop' },
]

function StarRating({ value = 5 }) {
  return (
    <div className="rating" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

function Categories() {
  return (
    <section className="section">
      <h2 className="section-title">Categories</h2>
      <div className="categories-grid">
        {categories.map((c) => (
          <Link key={c.name} to="/shop" className="category-card">
            <div className="category-thumb">
              <img src={c.img} alt={c.name} loading="lazy" decoding="async" />
            </div>
            <div className="category-name">{c.name}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function BestSellers() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()
  const { user } = useAuth()
  const { openCart } = useUi()
  const wishlist = useWishlist()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchProductsApi(5)
        if (!mounted) return
        setItems(data.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          currency: p.currency,
          img: p.image_128 ? `data:image/png;base64,${p.image_128}` : null,
          rating: 5,
        })))
      } catch (e) {
        setError('Showing demo products')
        setItems(fallbackProducts)
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <section className="section">
      <h2 className="section-title">Best Sellers</h2>
      {loading && (
        <div className="skeleton-grid" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-thumb" />
              <div className="skeleton-line" />
              <div className="skeleton-line sm" />
            </div>
          ))}
        </div>
      )}
      {error && <div className="hint">{error}</div>}
      <div className="products-grid">
        {items.map((p) => (
          <div key={p.id || p.name} className="product-card">
            <Link to={`/product/${encodeURIComponent(p.id || p.name)}`} className="product-link" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-thumb">
                {p.img ? (
                  <img src={p.img} alt={p.name} loading="lazy" decoding="async" />
                ) : (
                  <div className="placeholder" aria-label={p.name} />
                )}
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-price">{typeof p.price === 'number' ? `QAR ${p.price.toFixed(2)}` : ''}</div>
                <div className="rating" aria-label={`${p.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < p.rating ? 'star filled' : 'star'}>★</span>
                  ))}
                </div>
              </div>
            </Link>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn ghost" onClick={() => { if (!user) { alert('Please login to add items to cart'); return } addItem({ id: p.id || p.name, name: p.name, price: p.price, currency: p.currency, img: p.img }); openCart() }}>Add to Cart</button>
              <button className="btn" aria-pressed={wishlist.isInWishlist(p.id)} onClick={() => wishlist.toggle({ id: p.id, name: p.name, price: p.price, img: p.img })}>{wishlist.isInWishlist(p.id) ? '♥' : '♡'}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const end = new Date()
    end.setDate(end.getDate() + 7)
    const t = setInterval(() => {
      const now = new Date()
      const diff = Math.max(0, end.getTime() - now.getTime())
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / (1000 * 60)) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setTimeLeft({ d, h, m, s })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <section className="promo">
      <div className="promo-media">
        <img src={promoImg} alt="Summer sale" onError={(e) => { e.currentTarget.src = promoFallback }} />
      </div>
      <div className="promo-content">
        <div className="promo-title">Summer Sale –</div>
        <div className="promo-subtitle">Up to 40% OFF</div>
        <Link to="/shop" className="btn primary">Shop Sale</Link>
        <div className="countdown" aria-label="Sale ends in">
          <span aria-hidden="true" style={{ opacity: 0.9 }}>Ends in</span>
          <span className="pill">{String(timeLeft.d).padStart(2, '0')}d</span>
          <span className="pill">{String(timeLeft.h).padStart(2, '0')}h</span>
          <span className="pill">{String(timeLeft.m).padStart(2, '0')}m</span>
          <span className="pill">{String(timeLeft.s).padStart(2, '0')}s</span>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section">
      <h2 className="section-title">What Our Customers Say</h2>
      <div className="testimonial-list">
        {[{
          img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
          text: 'I absolutely love these products! They make my skin feel amazing.',
          name: 'Sara M.'
        },{
          img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=300&auto=format&fit=crop',
          text: 'Great quality and super fast delivery. Highly recommended!',
          name: 'Aisha K.'
        },{
          img: 'https://images.unsplash.com/photo-1546456073-6712f79251bb?q=80&w=300&auto=format&fit=crop',
          text: 'My go-to store for skincare. Excited every time I order.',
          name: 'Noora A.'
        }].map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="avatar">
              <img src={t.img} alt={t.name} loading="lazy" decoding="async" />
            </div>
            <div className="testimonial-content">
              <p>{t.text}</p>
              <StarRating value={5} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function App() {
  return (
    <main className="page">
      <HeroBanner />
      <section className="section">
        <div className="usp-strip">
          <div className="usp-item"><div className="usp-icon">🚚</div><div className="usp-text"><div className="usp-title">Free Shipping</div><div className="usp-sub">Over QAR 200</div></div></div>
          <div className="usp-item"><div className="usp-icon">↩️</div><div className="usp-text"><div className="usp-title">Easy Returns</div><div className="usp-sub">30-day guarantee</div></div></div>
          <div className="usp-item"><div className="usp-icon">🕑</div><div className="usp-text"><div className="usp-title">Fast Support</div><div className="usp-sub">9am–9pm daily</div></div></div>
          <div className="usp-item"><div className="usp-icon">🔒</div><div className="usp-text"><div className="usp-title">Secure Checkout</div><div className="usp-sub">256-bit SSL</div></div></div>
        </div>
      </section>
      <Categories />
      <BestSellers />
      <PromoBanner />
      <Testimonials />
    </main>
  )
}

export default App
