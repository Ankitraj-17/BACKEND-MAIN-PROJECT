# 🗄️ Document Management System (DMS)
### Enterprise Multi-File Document Management & Access Control

A production-ready Full-Stack Document Management System built with **Node.js, Express.js, MongoDB (Mongoose), Multer, and React (Vite)**. Designed for organizations to allow employees to upload, organize, and inspect official records (ID proofs, certificates, tax slips, etc.) with strict ownership and role-based access control.

---

## 🌐 Live Deployments

- **Live Application (Frontend)**: [https://docuvault-portal.vercel.app](https://docuvault-portal.vercel.app)
- **Live REST API (Backend)**: [https://docuvault-backend-fg1q.onrender.com](https://docuvault-backend-fg1q.onrender.com)
- **API Health Check**: [https://docuvault-backend-fg1q.onrender.com/api/health](https://docuvault-backend-fg1q.onrender.com/api/health)


## 🚀 Key Features

- **Multi-File Upload via Multer**: Employees can attach and upload multiple files (PDF, DOCX, PNG, JPG) simultaneously in a single submission.
- **Ownership-Based Authorization**: Only the uploading employee or an administrator can view, update, or delete a document.
- **Role-Based Authorization (RBAC)**: Administrators can inspect and audit all documents across the organization and manage company-wide records.
- **Category-Based Filtering & Search**: Instant filtering by categories (`ID Proof`, `Certificate`, `Tax Document`, `Resume`, `Medical`, `Contract`, `Other`) and text search.
- **Safe File Deletion**: When a document record is deleted, its physical files on the server disk are automatically unlinked and cleaned up.
- **Authentication**: Secure JWT token generation and bcrypt password hashing.
- **Modern Responsive UI**: Clean dashboard, drag-and-drop dropzone, live upload progress, and document details inspection.

---

## 📁 Project Architecture & Folder Structure

```text
Backend Main Project/
├── server/
│   ├── .env.example              # Environment variables template
│   ├── .env                      # Local environment configuration
│   ├── package.json              # Server dependencies and scripts
│   ├── server.js                 # Express application entry point
│   ├── uploads/                  # Upload destination directory
│   └── src/
│       ├── config/
│       │   └── db.js             # Mongoose MongoDB connection
│       ├── models/
│       │   ├── User.js           # User schema (roles: employee, admin)
│       │   └── Document.js       # Document schema with file metadata
│       ├── middleware/
│       │   ├── auth.middleware.js   # JWT protect & role authorize
│       │   ├── upload.middleware.js # Multer multi-file disk storage & mime check
│       │   └── error.middleware.js  # Centralized error handler
│       ├── controllers/
│       │   ├── auth.controller.js     # Register, Login, Me
│       │   └── document.controller.js # CRUD, category filter, cleanup
│       └── routes/
│           ├── auth.routes.js     # Auth API routes
│           └── document.routes.js # Document API routes
│
├── client/
│   ├── package.json              # Frontend dependencies and scripts
│   ├── vite.config.js            # Vite build configuration with proxy
│   ├── index.html                # HTML entry template
│   ├── .env.example              # Client environment template
│   └── src/
│       ├── main.jsx              # React root entry
│       ├── App.jsx               # Routes and layout definition
│       ├── App.css               # Component design system & utilities
│       ├── index.css             # Design tokens and base styles
│       ├── api/
│       │   └── axios.js          # Axios client with JWT interceptor
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state provider
│       ├── components/
│       │   ├── Navbar.jsx        # Navigation bar with user badge
│       │   ├── ProtectedRoute.jsx# Auth and Role guards
│       │   └── DocumentCard.jsx  # Document presentation card
│       └── pages/
│           ├── Login.jsx          # User login
│           ├── Register.jsx       # Employee & Admin registration
│           ├── Dashboard.jsx      # Documents grid, category filter, metrics
│           ├── UploadDocument.jsx # Multi-file upload form with preview
│           ├── DocumentDetails.jsx# View, download files, edit, delete
│           └── AdminDashboard.jsx # Organization-wide audit dashboard
│
├── postman_collection.json       # Postman & Thunder Client test collection
└── README.md                     # Comprehensive documentation
```

---

## 🛠️ Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or later)
- [MongoDB](https://www.mongodb.com/) running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

### 1. Server Setup
```bash
cd server
npm install

# Copy environment template if not already present
cp .env.example .env

# Start the server (runs on port 5000)
npm run dev
# or: npm start
```

### 2. Client Setup
```bash
cd client
npm install

# Start Vite dev server (runs on port 5173)
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📡 REST API Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register user (`employee` or `admin`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile |

### Document Routes (`/api/documents`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/documents` | Private (Owner/Admin) | Upload document with multiple files via Multer (`files`) |
| `GET` | `/api/documents` | Private | Get documents (Employees see their own; Admins see all) |
| `GET` | `/api/documents?category=:cat` | Private | Filter documents by category |
| `GET` | `/api/documents?search=:term` | Private | Search documents by title/description |
| `GET` | `/api/documents/:id` | Private (Owner or Admin) | Get single document and file download links |
| `PUT` | `/api/documents/:id` | Private (Owner or Admin) | Update document title, category, or description |
| `DELETE` | `/api/documents/:id` | Private (Owner or Admin) | Delete document and remove physical files from disk |
| `GET` | `/api/documents/metrics/stats`| Private | Get statistics and category counts |

---

## 🔒 Authorization Logic

1. **Ownership Check**:
   Every document stores an `uploadedBy` reference pointing to the user's `_id`.
   When a user requests `GET /documents/:id`, `PUT /documents/:id`, or `DELETE /documents/:id`, the server verifies:
   ```javascript
   const isOwner = document.uploadedBy.toString() === req.user._id.toString();
   const isAdmin = req.user.role === 'admin';
   if (!isOwner && !isAdmin) {
     return res.status(403).json({ success: false, message: 'Access denied' });
   }
   ```
2. **List Segregation**:
   When an employee requests `GET /documents`, the query automatically includes `{ uploadedBy: req.user._id }`. Admins see all documents by default.

---

## ☁️ Deployment

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a user and password.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere).
4. Copy your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/docuvault?retryWrites=true&w=majority`.

### 2. Backend (Render)
1. Connect your repository to [Render](https://render.com) and create a **Web Service**.
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install` and **Start Command** to `node server.js`.
4. Configure the environment variables in the Render dashboard:
   - `PORT`: `5001` (or leave default provided by Render)
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET`: `<A strong random secret string>`
   - `JWT_EXPIRE`: `7d`
   - `UPLOAD_PATH`: `uploads`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://<your-frontend>.vercel.app` (supports comma-separated origins)

> **Important Note:** On Render's free plan the disk is temporary, so uploaded files can be lost when the service restarts or redeploys.

### 3. Frontend (Vercel)
1. Connect your repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Framework Preset: **Vite** (Build command: `npm run build`, Output directory: `dist`).
4. Configure the environment variable in the Vercel dashboard:
   - `VITE_API_URL`: `https://<your-backend>.onrender.com` (with or without `/api`)
5. Deploy! The included `client/vercel.json` ensures all client-side routes redirect to `/index.html` without 404 errors on refresh.
