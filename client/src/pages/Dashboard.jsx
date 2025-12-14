import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/workflows')
      setItems(data)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load')
    } finally { setLoading(false) }
  }

  async function create() {
    try {
      const { data } = await api.post('/workflows', { name: name || 'New Workflow' })
      nav(`/editor/${data.id}`)
    } catch (e) { console.error('Create failed', e); alert(e?.response?.data?.error || e.message || 'Create failed') }
  }

  async function remove(id) {
    if (!confirm('Delete this workflow?')) return
    try { await api.delete(`/workflows/${id}`); load() } catch (e) { alert('Delete failed') }
  }

  return (
    <div>
      <h2>Workflows</h2>
      <div className="toolbar">
        <input placeholder="Workflow name" value={name} onChange={e=>setName(e.target.value)} />
        <button className="btn" onClick={create}>+ New Workflow</button>
      </div>
      {loading ? <div>Loading...</div> : error ? <div>{error}</div> : (
        <div className="list">
          {items.length === 0 && <div className="list-item">No workflows yet</div>}
          {items.map(w => (
            <div className="list-item" key={w.id}>
              <div>
                <div style={{fontWeight:600}}>{w.name}</div>
                <div className="badge">Updated {new Date(w.updatedAt).toLocaleString()}</div>
              </div>
              <div>
                <Link className="btn" to={`/editor/${w.id}`}>Open</Link>
                <button className="btn secondary" onClick={()=>remove(w.id)} style={{marginLeft:8}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}