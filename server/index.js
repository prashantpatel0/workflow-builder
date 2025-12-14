import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import workflowsRouter from './routes/workflows.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Ensure data directories
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const workflowsDir = path.join(dataDir, 'workflows');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(workflowsDir)) fs.mkdirSync(workflowsDir);
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify([]));

// Attach paths to app locals for routers
app.locals.paths = { dataDir, usersFile, workflowsDir };

// API info endpoint (moved under /api to avoid clashing with SPA index)
app.get('/api', (req, res) => {
  res.json({ app: 'Workflow Builder API', status: 'ok', endpoints: ['/api/health','/api/workflows'] });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/workflows', (req, res, next) => {
  req.appPaths = app.locals.paths;
  next();
}, workflowsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// Serve client build in production
const clientDir = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDir)) {
  app.use(express.static(clientDir));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).end();
    res.sendFile(path.join(clientDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});