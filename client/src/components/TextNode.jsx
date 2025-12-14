import React, { useRef, useState, useEffect } from 'react'
import { Handle, Position, useReactFlow } from 'reactflow'

export default function TextNode({ id, data, isConnectable, selected }) {
  const { width = 220, height = 80, text = '' } = data || {}
  const { setNodes } = useReactFlow()

  const [localSize, setLocalSize] = useState({ w: width, h: height })
  const [value, setValue] = useState(text || '')

  const sizeRef = useRef({ w: width, h: height })
  const editorRef = useRef(null)
  const isEditing = useRef(false) // Track if user is actively typing

  // Sync value when external data.text changes (e.g. undo, load, duplicate)
  useEffect(() => {
    if (!isEditing.current) {
      setValue(text || '')
    }
  }, [text])

  // Update size ref when localSize changes
  useEffect(() => {
    sizeRef.current = { w: localSize.w, h: localSize.h }
  }, [localSize])

  const beginResize = (e, dir) => {
    e.stopPropagation()
    e.preventDefault()

    const startX = e.clientX
    const startY = e.clientY
    const startW = sizeRef.current.w
    const startH = sizeRef.current.h

    const move = (ev) => {
      const dw = ev.clientX - startX
      const dh = ev.clientY - startY
      let nw = startW
      let nh = startH

      if (dir.includes('r')) nw = startW + dw
      if (dir.includes('l')) nw = startW - dw
      if (dir.includes('b')) nh = startH + dh
      if (dir.includes('t')) nh = startH - dh

      if (ev.shiftKey) {
        const ratio = (startW || 1) / (startH || 1)
        if (Math.abs(dw) > Math.abs(dh)) {
          nh = nw / ratio
        } else {
          nw = nh * ratio
        }
      }

      nw = Math.max(100, nw)
      nh = Math.max(40, nh)

      sizeRef.current = { w: nw, h: nh }
      setLocalSize({ w: nw, h: nh })
    }

    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)

      const { w, h } = sizeRef.current
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, width: w, height: h, text: value } }
            : n
        )
      )
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const onBlur = () => {
    isEditing.current = false
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: { ...n.data, text: value, width: localSize.w, height: localSize.h },
            }
          : n
      )
    )
  }

  const onFocus = () => {
    isEditing.current = true
  }

  const stop = (e) => e.stopPropagation()

  // Auto-focus when selected or empty
  useEffect(() => {
    if (selected && editorRef.current) {
      editorRef.current.focus()
      // Place cursor at end
      const len = editorRef.current.value.length
      editorRef.current.setSelectionRange(len, len)
    }
  }, [selected])

  return (
    <div className="shape-node" onClick={stop}>
      <div
        className="shape"
        style={{
          width: localSize.w,
          height: localSize.h,
          border: '2px solid var(--shape-stroke)',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 8,
        }}
      >
        <textarea
          ref={editorRef}
          className="nodrag"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          onMouseDown={stop}
          onClick={stop}
          onDoubleClick={stop}
          spellCheck={false}
          style={{
            width: '100%',
            height: '100%',
            resize: 'none',
            border: 'none',
            background: 'transparent',
            color: 'var(--text)',
            textAlign: 'left',
            outline: 'none',
            font: 'inherit',
            lineHeight: 1.4,
            padding: 0,
            margin: 0,
            caretColor: 'var(--text)',
          }}
        />
      </div>

      {selected && (
        <>
          <div className="resizer tl nodrag" onMouseDown={(e) => beginResize(e, 'tl')} />
          <div className="resizer t nodrag" onMouseDown={(e) => beginResize(e, 't')} />
          <div className="resizer tr nodrag" onMouseDown={(e) => beginResize(e, 'tr')} />
          <div className="resizer r nodrag" onMouseDown={(e) => beginResize(e, 'r')} />
          <div className="resizer br nodrag" onMouseDown={(e) => beginResize(e, 'br')} />
          <div className="resizer b nodrag" onMouseDown={(e) => beginResize(e, 'b')} />
          <div className="resizer bl nodrag" onMouseDown={(e) => beginResize(e, 'bl')} />
          <div className="resizer l nodrag" onMouseDown={(e) => beginResize(e, 'l')} />
        </>
      )}

      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}
