import { useUi } from '../state/UiContext.jsx'
import { useCart } from '../state/CartContext.jsx'
import '../App.css'

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUi()
  const { items, totalPrice, setQty, removeItem } = useCart()
  return (
    <div className={`cart-drawer-root ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
      <div className="drawer-backdrop" onClick={closeCart} />
      <aside className="drawer-panel">
        <div className="drawer-header">
          <strong>Cart</strong>
          <button className="btn ghost" onClick={closeCart}>Close</button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="hint">Your cart is empty.</div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="cart-row">
                <div className="cart-thumb">{it.img ? <img src={it.img} alt={it.name} /> : null}</div>
                <div className="cart-info">
                  <div style={{ fontWeight: 700 }}>{it.name}</div>
                  <div>QAR {Number(it.price || 0).toFixed(2)}</div>
                </div>
                <div className="cart-qty">
                  <button className="btn sm" onClick={() => setQty(it.id, Math.max(0, (it.qty || 1) - 1))}>-</button>
                  <span className="qty-num">{it.qty}</span>
                  <button className="btn sm" onClick={() => setQty(it.id, (it.qty || 1) + 1)}>+</button>
                </div>
                <button className="btn sm" onClick={() => removeItem(it.id)}>Remove</button>
              </div>
            ))
          )}
        </div>
        <div className="drawer-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontWeight: 700 }}>Total</div>
            <div style={{ fontWeight: 700 }}>QAR {Number(totalPrice || 0).toFixed(2)}</div>
          </div>
          <a href="/checkout" className="btn primary" style={{ width: '100%', justifyContent: 'center' }}>Checkout</a>
        </div>
      </aside>
    </div>
  )
}


