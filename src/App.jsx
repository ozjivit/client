import './App.css'
import { useEffect, useState } from 'react'
import { fetchProducts as fetchProductsApi } from './api'
import { Link } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import { useCart } from './state/CartContext.jsx'
import cat1 from './assets/category/1.jpg'
import cat2 from './assets/category/2.jpg'
import cat3 from './assets/category/3.jpg'
import cat4 from './assets/category/4.jpg'
import cat5 from './assets/category/5.jpg'
// Only 1-5 exist in assets/category

const categories = [
  { name: 'Category 1', img: cat1 },
  { name: 'Category 2', img: cat2 },
  { name: 'Category 3', img: cat3 },
  { name: 'Category 4', img: cat4 },
  { name: 'Category 5', img: cat5 },
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
              <img src={c.img} alt={c.name} />
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

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchProductsApi(12)
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
      {loading && <div>Loading products…</div>}
      {error && <div className="hint">{error}</div>}
      <div className="products-grid">
        {items.map((p) => (
          <div key={p.id || p.name} className="product-card">
            <Link to={`/product/${encodeURIComponent(p.id || p.name)}`} className="product-link" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-thumb">
                {p.img ? (
                  <img src={p.img} alt={p.name} />
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
            <button className="btn ghost" onClick={() => addItem({ id: p.id || p.name, name: p.name, price: p.price, currency: p.currency, img: p.img })}>Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  )
}

function PromoBanner() {
  return (
    <section className="promo">
      <div className="promo-media">
        <img src="https://images.unsplash.com/photo-1585238342028-4bbc1a31f7bc?q=80&w=1200&auto=format&fit=crop" alt="Makeup flat lay" />
      </div>
      <div className="promo-content">
        <div className="promo-title">Summer Sale –</div>
        <div className="promo-subtitle">Up to 40% OFF</div>
        <button className="btn primary">Shop Sale</button>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section">
      <h2 className="section-title">What Our Customers Say</h2>
      <div className="testimonial-list">
        <div className="testimonial-card">
          <div className="avatar">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop" alt="Customer" />
          </div>
          <div className="testimonial-content">
            <p>I absolutely love these products! They make my skin feel amazing.</p>
            <StarRating value={5} />
          </div>
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <main className="page">
      <Hero />
      <Categories />
      <BestSellers />
      <PromoBanner />
      <Testimonials />
    </main>
  )
}

export default App
