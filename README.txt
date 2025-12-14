Workflow Builder - Full Stack App

Features:
- React + Vite frontend with React Flow canvas
- Node.js + Express backend with JWT auth
- Users can register/login
- Create, view, edit, delete workflows
- Drag-and-drop nodes/edges; add/delete; import/export JSON
- Save/load persisted per user

Setup
1) Backend
   - cd server
   - cp .env.example .env  (edit JWT_SECRET if desired)
   - npm install
   - npm run dev (or npm start)
   Server runs on http://localhost:4000

2) Frontend
   - cd client
   - npm install
   - echo "VITE_API_URL=http://localhost:4000/api" > .env
   - npm run dev
   App runs on http://localhost:5173

Usage
- Open the app, register an account, then login
- Create a workflow from Dashboard
- In Editor: use Palette to add nodes, drag them around, connect by dragging handles, delete selected via button, Save
- Import/Export JSON in Editor

Notes
- Data stored in server/data/users.json and server/data/workflows/<userId>/*.json
- For production, replace file storage with a database and enable HTTPS, secure JWT secret, etc.
