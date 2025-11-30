<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Silicon Sage - Frontend

AI-powered PC builder interface built with React + TypeScript and Tailwind CSS.

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

3. Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
front_end/
├── pages/
│   ├── Home.tsx           # Build configuration form
│   └── ReportDashboard.tsx # Results with chat interface
├── types.ts               # TypeScript schemas
├── constants.ts           # App constants
├── App.tsx                # Main app component
└── vite-env.d.ts          # Vite environment types
```

## Key Features

- **Home Page**: Configure PC build requirements

  - Budget allocation (MYR/USD/EUR)
  - Primary use cases selection
  - Hardware specifications (resolution, form factor)
  - Aesthetic preferences (RGB, color, platform)

- **Report Dashboard**: View generated build
  - Component compatibility verification
  - Performance estimates (wattage, FPS)
  - Real-time chat with AI agent
  - Direct purchase links

## API Integration

The frontend connects to the backend at `VITE_API_URL`:

### Build Generation

```
POST /api/build
Body: SiliconSageBuildRequest
Response: SiliconSageBuildReport
```

### Primary Use Options

```
GET /api/primary-use-options
Response: { options: string[] }
```

## Environment Variables

- `VITE_API_URL` - Backend API server URL (default: `http://localhost:8000`)

## Build

```bash
npm run build
```

Output will be in the `dist/` directory.

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library
- **React Router** - Navigation
- **Vite** - Build tool

---

**See the main [README.md](../README.md) for full project documentation.**
