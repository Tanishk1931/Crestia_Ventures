# Setup guide

## Prerequisites

- Node.js 18 or newer
- npm

```powershell
node --version
npm --version
```

## Main website (Home)

```powershell
cd frontend/home
npm ci
npm run dev
```

If `npm ci` fails because the root lockfile was empty historically, use `npm install` once to regenerate `package-lock.json`, then prefer `npm ci` afterward.

Usual URL: http://localhost:5173

```powershell
npm run build
npm run preview
```

Build output: `deployment/production-build/`

## RCM services

```powershell
cd frontend/rcm
npm ci
npm run dev
```

```powershell
npm run build   # → deployment/godaddy/public_html/rcm/
```

## Healthcare / medical islands

```powershell
cd frontend/healthcare
npm ci
npm run build   # → deployment/godaddy/public_html/medical/
```

## IT recruitment application

```powershell
cd frontend/it-recruitment
npm ci
npm run dev
```

```powershell
npm run lint
npm run build
npm run preview
```

## Run all three projects

```powershell
# Terminal 1
cd frontend/home
npm run dev
```

```powershell
# Terminal 2
cd frontend/it-recruitment
npm run dev -- --port 5174
```

```powershell
# Terminal 3
cd frontend/rcm
npm run dev -- --port 5175
```
