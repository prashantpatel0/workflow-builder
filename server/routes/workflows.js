import express from 'express';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
const router = express.Router();
const USER_ID = 'public';

function workflowPath(baseDir, userId, id) {
  const userDir = path.join(baseDir, userId);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
  return path.join(userDir, `${id}.json`);
}

router.get('/', (req, res) => {
  const { workflowsDir } = req.appPaths;
  const userDir = path.join(workflowsDir, USER_ID);
  if (!fs.existsSync(userDir)) return res.json([]);
  const files = fs.readdirSync(userDir).filter(f => f.endsWith('.json'));
  const list = files.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(userDir, f), 'utf-8'));
    return { id: data.id, name: data.name, updatedAt: data.updatedAt };
  });
  res.json(list.sort((a,b)=> (b.updatedAt || '').localeCompare(a.updatedAt || '')));
});

router.post('/', (req, res) => {
  try {
    const { workflowsDir } = req.appPaths;
    const { name, graph } = req.body || {};
    const id = nanoid(10);
    const wf = { id, userId: USER_ID, name: name || 'Untitled Workflow', graph: graph || { nodes: [], edges: [] }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const file = workflowPath(workflowsDir, USER_ID, id);
    fs.writeFileSync(file, JSON.stringify(wf, null, 2));
    res.status(201).json(wf);
  } catch (err) {
    console.error('Create workflow failed', err);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

router.get('/:id', (req, res) => {
  const { workflowsDir } = req.appPaths;
  const file = workflowPath(workflowsDir, USER_ID, req.params.id);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
  const wf = JSON.parse(fs.readFileSync(file, 'utf-8'));
  res.json(wf);
});

router.put('/:id', (req, res) => {
  const { workflowsDir } = req.appPaths;
  const file = workflowPath(workflowsDir, USER_ID, req.params.id);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
  const { name, graph } = req.body;
  const wf = JSON.parse(fs.readFileSync(file, 'utf-8'));
  if (name !== undefined) wf.name = name;
  if (graph !== undefined) wf.graph = graph;
  wf.updatedAt = new Date().toISOString();
  fs.writeFileSync(file, JSON.stringify(wf, null, 2));
  res.json(wf);
});

router.delete('/:id', (req, res) => {
  const { workflowsDir } = req.appPaths;
  const file = workflowPath(workflowsDir, USER_ID, req.params.id);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
  fs.unlinkSync(file);
  res.json({ ok: true });
});

export default router;