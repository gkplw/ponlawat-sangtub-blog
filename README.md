# Personal Blog

A personal blogging platform designed for both writers and readers. This system allows authors to easily create, manage, and publish content while giving readers a seamless browsing experience. With features like article categorization, author profiles, and interactive elements such as comments and likes, this platform aims to foster a vibrant community of content creators and consumers.

## Tech Stack

### Frontend
- **React 19** + **Vite** - Modern UI framework with fast build tooling
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client with JWT interceptors
- **React Markdown** - Markdown rendering for articles
- **Sonner** - Toast notifications

### Backend
- **Express.js** - Node.js web framework
- **Supabase** - PostgreSQL database
- **JWT** - Authentication & authorization
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## Features

- 🔐 User authentication (signup, login, reset password)
- 👤 User profiles and personalized dashboards
- 📝 Create and edit articles with Markdown support
- 🗂️ Category management
- 💬 Comments system
- ❤️ Like/unlike posts
- 🛡️ Admin panel
- 📊 Article management dashboard
- 🔍 Article filtering and pagination
- 📱 Responsive design

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (user & admin)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service layer
│   │   └── utils/          # Utility functions
│   └── dist/               # Production build
│
└── server/                 # Express backend
    ├── controllers/        # Business logic
    ├── routes/             # API routes
    ├── middlewares/        # Validation & auth middleware
    └── utils/              # Helper utilities
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Supabase account

### Environment Variables

Create `.env` file in the `server/` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```

### Installation

1. **Install server dependencies:**
```bash
cd server
npm install
```

2. **Install client dependencies:**
```bash
cd client
npm install
```

### Running the Application

1. **Start the backend server:**
```bash
cd server
npm start
# Runs on http://localhost:4000
```

2. **Start the frontend dev server:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/auth/*` | Authentication routes (login, register, reset password) |
| `/posts/*` | Post CRUD operations |
| `/categories/*` | Category management |
| `/comments/*` | Comment operations |
| `/likes/*` | Like/unlike posts |
| `/statuses/*` | Post status management |

## Build for Production

```bash
cd client
npm run build
```

The optimized production build will be in `client/dist/`.

## Database Schema

See `supabase-schema.png` for the complete database structure.

## License

ISC

