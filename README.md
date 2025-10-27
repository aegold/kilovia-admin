# 🎓 Kilovia Admin - E-Learning Management System

> Modern admin dashboard for managing questions, topics, and exercises in the Kilovia e-learning platform.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 + Vite 7
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS with modular architecture
- **Build Tool**: Vite with HMR

## 📁 Project Structure

```
kilovia-admin/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── question-creator/    # QuanLyBaiTap - Exercise Management
│   │   ├── question-list/       # QuanLyCauHoi - Question Management  
│   │   └── topic-management/    # QuanLyChuDe - Topic Management
│   ├── shared/            # Shared utilities
│   │   ├── components/    # Reusable components (SharedNavbar)
│   │   ├── services/      # API services (axios config)
│   │   └── constants/     # Constants (question kinds)
│   └── App.jsx            # Main app with routing
├── public/                # Static assets
└── vite.config.js         # Vite configuration
```

## 🏗️ Architecture Highlights

### Path Aliases
- `@` → `src/`
- `@shared` → `src/shared/`
- `@modules` → `src/modules/`

### Modules
Each module is self-contained with:
- Components
- Styles (CSS modules with prefixes: `qlbt-`, `qlch-`, `qlcd-`)
- Layout
- Services

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start dev server
npm start
# or
npm run dev
```

The app will open automatically at `http://localhost:5173`

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 🌐 API Configuration

Backend API: `http://localhost:8080/api`

Configure in `src/shared/services/axiosConfig.js`:
```js
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
  timeout: 10000
});
```

## 📦 Key Features

### 1. QuanLyBaiTap (Exercise Management)
- Create questions with multiple types (MCQ, Fill-in, Image choice, etc.)
- Real-time preview
- Template-based question generation
- Hierarchy selection (Grade → Subject → Topic → Subtopic)

### 2. QuanLyCauHoi (Question Management)
- View all questions in table format
- Sort by type, date, hierarchy
- Edit, delete, preview actions
- Compact hierarchy display

### 3. QuanLyChuDe (Topic Management)
- Manage curriculum hierarchy
- Create/edit topics and subtopics
- Hierarchical tree view

## 🎨 UI Components

- **SharedNavbar**: Unified navigation across modules
- **Question Renderers**: Support for 10+ question types
- **Hierarchy Selector**: Cascading dropdown for curriculum selection
- **Image Upload**: Drag-and-drop with preview

## 🔧 Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📝 Migration Notes

This project was migrated from Create React App to Vite:
- ✅ All 3 modules successfully migrated (72 files)
- ✅ Unified navigation system implemented
- ✅ Axios configuration centralized
- ✅ Build optimized (1.53s build time)

See `MIGRATION_SESSION_CONTEXT.md` for detailed migration history.

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Private repository - All rights reserved

## 👥 Team

Developed by the Kilovia team

