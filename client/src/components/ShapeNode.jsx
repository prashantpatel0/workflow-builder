import React, { useRef, useState } from 'react'
import { Handle, Position, useReactFlow } from 'reactflow'

export default function ShapeNode({ id, data, isConnectable, selected }) {
  const { shape = 'rect', width = 140, height = 60 } = data || {}
  const { setNodes } = useReactFlow()
  const [localSize, setLocalSize] = useState({ w: width, h: height })
  const sizeRef = useRef({ w: width, h: height })

  const beginResize = (e, dir) => {
    e.stopPropagation(); e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const startW = sizeRef.current.w
    const startH = sizeRef.current.h

    const move = (ev) => {
      const dw = ev.clientX - startX
      const dh = ev.clientY - startY
      const nw = Math.max(40, startW + (dir === 'r' || dir === 'br' ? dw : 0))
      const nh = Math.max(30, startH + (dir === 'b' || dir === 'br' ? dh : 0))
      sizeRef.current = { w: nw, h: nh }
      setLocalSize({ w: nw, h: nh })
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      const { w, h } = sizeRef.current
      setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, width: w, height: h } } : n))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const shapeStyle = {
    rect: { borderRadius: 6 },
    rounded: { borderRadius: 16 },
    ellipse: { borderRadius: 9999 },
    diamond: { transform: 'rotate(45deg)' },
    cube: {},
  }[shape] || {}

  // Cube fallback to outlined rectangle for simplicity
  const isCube = shape === 'cube'

  const content = isCube ? (
    <div className="shape" style={{ width: localSize.w, height: localSize.h, border: '2px solid var(--shape-stroke)', background: 'transparent', ...shapeStyle }} />
  ) : (
    <div className="shape" style={{ width: localSize.w, height: localSize.h, border: '2px solid var(--shape-stroke)', background: 'transparent', ...shapeStyle }} />
  )

  return (
    <div className="shape-node">
      {content}
      {selected && (
        <>
          <div className="resizer tl nodrag" onMouseDown={(e)=>beginResize(e,'tl')} />
          <div className="resizer t nodrag" onMouseDown={(e)=>beginResize(e,'t')} />
          <div className="resizer tr nodrag" onMouseDown={(e)=>beginResize(e,'tr')} />
          <div className="resizer r nodrag" onMouseDown={(e)=>beginResize(e,'r')} />
          <div className="resizer br nodrag" onMouseDown={(e)=>beginResize(e,'br')} />
          <div className="resizer b nodrag" onMouseDown={(e)=>beginResize(e,'b')} />
          <div className="resizer bl nodrag" onMouseDown={(e)=>beginResize(e,'bl')} />
          <div className="resizer l nodrag" onMouseDown={(e)=>beginResize(e,'l')} />
        </>
      )}
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}
