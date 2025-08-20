import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../state/CartContext.jsx'
import { useToast } from '../state/ToastContext.jsx'
import { fetchProducts } from '../api'
import '../App.css'

function StarRating({ value = 5 }) {
  return (
    <div className="rating" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

export default function Shop() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()
  const toast = useToast()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchProducts(200)
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
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <main className="page">
      <section className="section">
        <h2 className="section-title">Shop</h2>
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
                  <StarRating value={p.rating} />
                </div>
              </Link>
              <button
                className="btn ghost"
                onClick={() => { addItem({ id: p.id || p.name, name: p.name, price: p.price, currency: 'QAR', img: p.img }); toast.success('Added to cart') }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
} 