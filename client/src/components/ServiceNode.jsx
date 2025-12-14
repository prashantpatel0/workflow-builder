import React, { useEffect, useState } from 'react'
import { Handle, Position } from 'reactflow'

const fallbackIcon =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4" ry="4"/><path d="M3 9h18M9 21V9"/></svg>`
  )

const ICON_CACHE = new Map()
const transparentPx = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='


function ServiceNode({ id, data, isConnectable }) {
  const { label, icon } = data || {}
  const [src, setSrc] = useState(transparentPx)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function resolve() {
      if (!icon) { setSrc(transparentPx); setLoaded(false); return }
      if (ICON_CACHE.has(icon)) {
        setSrc(ICON_CACHE.get(icon)); setLoaded(true); return
      }
      try {
        if (icon.startsWith('/') || icon.startsWith('./')) {
          ICON_CACHE.set(icon, icon)
          if (!cancelled) { setSrc(icon); setLoaded(true) }
          return
        }
        const res = await fetch(icon, { mode: 'cors' })
        if (!res.ok) throw new Error('icon fetch failed')
        const blob = await res.blob()
        const objUrl = URL.createObjectURL(blob)
        ICON_CACHE.set(icon, objUrl)
        if (!cancelled) { setSrc(objUrl); setLoaded(true) }
      } catch (err) {
        ICON_CACHE.set(icon, fallbackIcon)
        if (!cancelled) { setSrc(fallbackIcon); setLoaded(true) }
      }
    }
    resolve()
    return () => { cancelled = true }
  }, [icon])

  return (
    <div className="node-card">
      <div className="node-inner">
        <img src={src} alt={label || 'Service'} className="node-icon" width={20} height={20} loading="lazy" decoding="async" draggable={false} style={{opacity: loaded ? 1 : 0, transition:'opacity .15s ease'}} />
        <div className="node-label">{label || 'Service'}</div>
      </div>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}

export default React.memo(ServiceNode)
