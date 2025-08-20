import { useState } from 'react'
import { submitContact } from '../api'
import '../App.css'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setResult(null)
    setSubmitting(true)
    try {
      const res = await submitContact({ name, email, message })
      if (res && res.ok) {
        setResult({ ok: true, msg: 'Thanks! Your message has been sent.' })
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setResult({ ok: false, msg: res?.error || 'Failed to send message' })
      }
    } catch (err) {
      setResult({ ok: false, msg: err.message || 'Failed to send message' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page">
      <section className="section">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-card">
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" rows={6} required />
            </div>
            <div className="form-actions">
              <button className="btn primary" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send Message'}</button>
            </div>
            {result && (
              <div className={`hint ${result.ok ? 'success' : 'error'}`}>{result.msg}</div>
            )}
          </form>
          <div className="contact-aside">
            <div className="contact-aside-title">Get in touch</div>
            <div className="contact-aside-text">We usually reply within 1 business day.</div>
            <div className="contact-aside-list">
              <div>
                <div className="meta-label">Email</div>
                <div className="meta-value">torontobeaty@gmail.com</div>
              </div>
              <div>
                <div className="meta-label">Phone</div>
                <div className="meta-value">+974 3080 069</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}


