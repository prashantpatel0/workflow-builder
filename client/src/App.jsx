import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'

function Header() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'dark')
  React.useEffect(() => {
    if (theme === 'light') document.documentElement.classList.add('light')
    else document.documentElement.classList.remove('light')
    localStorage.setItem('theme', theme)
  }, [theme])
  return (
    <header className="header">
      <div style={{display:'flex', alignItems:'center', gap:10}}>
        <div style={{width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#2563eb,#7c3aed)', display:'flex',alignItems:'center',justifyContent:'center', color:'#fff', fontWeight:700}}>WB</div>
        <Link to="/" style={{fontWeight:700}}>Workflow Builder</Link>
      </div>
      <nav style={{display:'flex', alignItems:'center', gap:12}}>
        <Link to="/">Dashboard</Link>
        <button className="btn secondary" onClick={()=> setTheme(t=> t === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </div>
    </>
  )
}