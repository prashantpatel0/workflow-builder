import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactFlow, { addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState, useReactFlow } from 'reactflow'
import 'reactflow/dist/style.css'
import api from '../lib/api'
import ServiceNode from '../components/ServiceNode'
import ShapeNode from '../components/ShapeNode'
import TextNode from '../components/TextNode'
import { CATALOG } from '../data/services'

const shapesGroup = {
  category: 'Shapes',
  items: [
    { id: 'rect', label: 'Rectangle', nodeType: 'shape', shape: 'rect', width: 160, height: 80 },
    { id: 'rounded', label: 'Rounded', nodeType: 'shape', shape: 'rounded', width: 160, height: 80 },
    { id: 'ellipse', label: 'Ellipse', nodeType: 'shape', shape: 'ellipse', width: 160, height: 80 },
    { id: 'diamond', label: 'Diamond', nodeType: 'shape', shape: 'diamond', width: 160, height: 80 },
    { id: 'cube', label: 'Cube', nodeType: 'shape', shape: 'cube', width: 160, height: 100 },
    { id: 'textbox', label: 'Textbox', nodeType: 'text' },
  ],
}

const PALETTE = [
  { category: 'Shapes', items: [
    { id: 'rect', label: 'Rectangle', nodeType: 'shape', shape: 'rect', width: 160, height: 80 },
    { id: 'rounded', label: 'Rounded', nodeType: 'shape', shape: 'rounded', width: 160, height: 80 },
    { id: 'ellipse', label: 'Ellipse', nodeType: 'shape', shape: 'ellipse', width: 160, height: 80 },
    { id: 'diamond', label: 'Diamond', nodeType: 'shape', shape: 'diamond', width: 160, height: 80 },
    { id: 'cube', label: 'Cube', nodeType: 'shape', shape: 'cube', width: 160, height: 100 },
    { id: 'textbox', label: 'Textbox', nodeType: 'text' },
  ]},
  ...CATALOG
]

function usePalette() {
  const [category, setCategory] = useState(PALETTE[0]?.category || '')
  const [query, setQuery] = useState('')
  const categories = PALETTE.map(c => c.category)
  const items = PALETTE.find(c => c.category === category)?.items || []
  const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
  return { category, setCategory, query, setQuery, categories, filtered, all: PALETTE }
}

function CategoryDropdownInner({ state }){
  const { category, setCategory, categories, query, setQuery } = state
  return (
    <div>
      <div style={{display:'flex', gap:8}}>
        <select className="input" value={category} onChange={e=>setCategory(e.target.value)} style={{flex:1}}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="input" placeholder="Search" value={query} onChange={e=>setQuery(e.target.value)} style={{flex:1}} />
      </div>
    </div>
  )
}

function PaletteListInner({ state, onAdd }){
  const { filtered } = state
  return (
    <div>
      {filtered.map((item, idx) => (
        <div key={idx} style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <div style={{display:'flex', alignItems:'center', gap:8}} draggable onDragStart={(e)=>{ e.dataTransfer.setData('application/json', JSON.stringify(item)) }}>
            {item.icon && <img src={item.icon} alt="" style={{width:18,height:18}} />}
            <span className="node-label" style={{color:'var(--text-strong)'}}>{item.label}</span>
          </div>
          <button className="btn secondary" onClick={()=>onAdd(item)}>Add</button>
        </div>
      ))}
    </div>
  )
}

const defaultNodes = [
  { id: 'reddit', position: { x: 50, y: 50 }, data: { label: 'Reddit', icon: 'https://cdn.simpleicons.org/reddit/FF4500' }, type: 'service' },
  { id: 'airflow', position: { x: 300, y: 50 }, data: { label: 'Apache Airflow', icon: 'https://cdn.simpleicons.org/apacheairflow' }, type: 'service' },
  { id: 'glue', position: { x: 550, y: 50 }, data: { label: 'AWS Glue', icon: 'https://cdn.simpleicons.org/amazonaws' }, type: 'service' },
  { id: 'redshift', position: { x: 800, y: 50 }, data: { label: 'Amazon Redshift', icon: 'https://cdn.simpleicons.org/amazonredshift' }, type: 'service' },
  { id: 'tableau', position: { x: 1050, y: 50 }, data: { label: 'Tableau', icon: 'https://cdn.simpleicons.org/tableau' }, type: 'service' },
]
const defaultEdges = [
  { id: 'e1', source: 'reddit', target: 'airflow' },
  { id: 'e2', source: 'airflow', target: 'glue' },
  { id: 'e3', source: 'glue', target: 'redshift' },
  { id: 'e4', source: 'redshift', target: 'tableau' },
]

function newNodeFromPalette(item) {
  const id = `${item.id}-${Math.random().toString(36).slice(2,8)}`
  if (item.nodeType === 'shape' || item.shape) {
    return {
      id,
      type: 'shape',
      position: { x: 100, y: 100 },
      data: { shape: item.shape, width: item.width || 160, height: item.height || 80 }
    }
  }
  if (item.nodeType === 'text') {
    return {
      id,
      type: 'text',
      position: { x: 100, y: 100 },
      data: { text: '' }
    }
  }
  return {
    id,
    type: 'service',
    position: { x: 100, y: 100 },
    data: { label: item.label, icon: item.icon }
  }
}

export default function Editor() {
  const { id } = useParams()
  const nav = useNavigate()
  const [name, setName] = useState('Untitled Workflow')
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) load()
  }, [id])

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get(`/workflows/${id}`)
      setName(data.name)
      setNodes(data.graph?.nodes || [])
      setEdges(data.graph?.edges || [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const onConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), [])

  const onAddNode = (p, position) => setNodes(nds => [...nds, { ...newNodeFromPalette(p), position: position || { x: 100, y: 100 } }])

  const onDeleteSelected = () => {
    // React Flow handles delete via onNodesChange/onEdgesChange if we wire selection state, but we add a manual helper
    setNodes(nds => nds.filter(n => !n.selected))
    setEdges(eds => eds.filter(e => !e.selected))
  }

  const onSave = async () => {
    setSaving(true)
    try {
      const payload = { name, graph: { nodes, edges } }
      if (id) {
        await api.put(`/workflows/${id}`, payload)
      } else {
        const { data } = await api.post('/workflows', payload)
        nav(`/editor/${data.id}`)
      }
    } catch (e) { alert('Save failed') } finally { setSaving(false) }
  }

  const onExport = () => {
    const blob = new Blob([JSON.stringify({ name, nodes, edges }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(name||'workflow').replace(/\s+/g,'_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const fileRef = useRef()
  const onImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (data.name) setName(data.name)
        if (Array.isArray(data.nodes)) setNodes(data.nodes)
        if (Array.isArray(data.edges)) setEdges(data.edges)
      } catch { alert('Invalid JSON') }
    }
    reader.readAsText(file)
  }

  const proOptions = { hideAttribution: true }

 const paletteState = usePalette()

  return (
    <div>
      <div className="toolbar">
        <input style={{minWidth:260}} value={name} onChange={e=>setName(e.target.value)} />
        <button className="btn" onClick={onSave} disabled={saving}>{saving? 'Saving...' : 'Save'}</button>
        <button className="btn secondary" onClick={onDeleteSelected}>Delete Selected</button>
        <button className="btn secondary" onClick={onExport}>Export JSON</button>
        <input type="file" accept="application/json" style={{display:'none'}} ref={fileRef} onChange={onImport} />
        <button className="btn secondary" onClick={()=>fileRef.current?.click()}>Import JSON</button>
      </div>

      <div style={{display:'flex', gap:12}}>
        <div className="card" style={{width:300, maxHeight:'calc(100vh - 180px)', overflowY:'auto'}}>
          <h4>Palette</h4>
          <div style={{marginBottom:8}}>
            <CategoryDropdownInner state={paletteState} />
          </div>
          <PaletteListInner state={paletteState} onAdd={(item)=>onAddNode(item)} />
        </div>

        <div className="flow-wrapper" style={{flex:1}}>
          {loading ? 'Loading...' : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={(e)=>{
                e.preventDefault()
                const bounds = e.currentTarget.getBoundingClientRect()
                const item = JSON.parse(e.dataTransfer.getData('application/json'))
                const position = { x: e.clientX - bounds.left, y: e.clientY - bounds.top }
                onAddNode(item, position)
              }}
              onDragOver={(e)=>{ e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
              snapToGrid
              snapGrid={[15,15]}
              fitView
              proOptions={proOptions}
              nodeTypes={{ service: ServiceNode, shape: ShapeNode, text: TextNode }}
            >
              <Background />
              <MiniMap />
              <Controls />
            </ReactFlow>
          )}
        </div>
      </div>
    </div>
  )
}