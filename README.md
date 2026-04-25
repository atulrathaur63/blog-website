# 📝 Personal Blog — MERN Stack

A clean, production-ready personal blog built with **MongoDB · Express · React (Vite) · Node.js**.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Public Blog** | Responsive post grid, category filter, search, full post view |
| **Rich Editor** | React Quill WYSIWYG with image embed support |
| **Admin Dashboard** | Login, create / edit / delete / toggle-publish posts |
| **JWT Auth** | Stateless auth stored in localStorage, auto-attached via Axios |
| **Image Upload** | Local multer upload (swap for Cloudinary in production) |
| **Slug Generation** | Auto-generated from title, guaranteed unique |
| **Read Time** | Calculated server-side from word count |
| **Toast Notifications** | react-hot-toast throughout |
| **Fully Responsive** | Mobile-first Tailwind CSS design |

---

## 🗂 Project Structure

```
blog-project/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   ├── db.js               # Mongoose connection
│   │   └── cloudinary.js       # Cloudinary config (optional)
│   ├── controllers/
│   │   ├── authController.js   # Login, getMe, seedAdmin
│   │   └── postController.js   # Full CRUD + image upload
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect()
│   │   ├── errorMiddleware.js  # Global error handler + 404
│   │   └── uploadMiddleware.js # Multer config
│   ├── models/
│   │   ├── AdminUser.js        # Admin schema (bcrypt hash)
│   │   └── Post.js             # Post schema (auto-slug, readTime)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── uploads/                # Local image storage
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express app entry point
│
└── frontend/                   # Vite + React 18
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── api/
    │   │   └── axios.js         # Axios instance + interceptors
    │   ├── components/
    │   │   ├── AdminLayout.jsx  # Dashboard shell (sidebar + main)
    │   │   ├── AdminSidebar.jsx # Navigation sidebar
    │   │   ├── BlogCard.jsx     # Post preview card
    │   │   ├── Footer.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Navbar.jsx       # Public top nav (scroll-aware)
    │   │   ├── PostForm.jsx     # Shared create/edit form + Quill
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state + login/logout
    │   ├── pages/
    │   │   ├── Home.jsx         # Blog listing, filter, search, pagination
    │   │   ├── BlogPost.jsx     # Full post view
    │   │   └── admin/
    │   │       ├── Login.jsx
    │   │       ├── Dashboard.jsx
    │   │       ├── PostsList.jsx
    │   │       ├── CreatePost.jsx
    │   │       └── EditPost.jsx
    │   ├── App.jsx              # Router tree
    │   ├── main.jsx
    │   └── index.css            # Tailwind + custom component classes
    ├── .env.example
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **MongoDB** running locally **or** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string
- **npm** or **yarn**

---

### 1 — Clone & install dependencies

```bash
# Clone
git clone <your-repo-url> blog-project
cd blog-project

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

---

### 2 — Configure environment variables

#### Backend
```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
PORT=5000
NODE_ENV=development

# MongoDB (local or Atlas)
MONGO_URI=mongodb://localhost:27017/personal_blog

# JWT — change this to a long random string in production!
JWT_SECRET=super_secret_change_me
JWT_EXPIRES_IN=7d

# Admin credentials used by the seed endpoint
ADMIN_EMAIL=admin@yourblog.com
ADMIN_PASSWORD=YourStrongPassword123!

# Frontend origin (for CORS)
FRONTEND_URL=http://localhost:5173

# Cloudinary (optional — only needed if swapping to cloud image hosting)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### Frontend
```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
VITE_BLOG_NAME=The Ink & Thought
```

---

### 3 — Start the backend

```bash
cd backend

# Development (auto-restarts on change)
npm run dev

# Production
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode
📡 API available at: http://localhost:5000/api
```

---

### 4 — Create the admin user (one-time setup)

The blog has exactly **one admin** user. Create them via the seed endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/seed
```

Or open the URL in Postman / your browser. This creates the admin with the email and password from your `.env`.

> ⚠️ After setup, you should **remove or disable** the `/api/auth/seed` route in `backend/routes/authRoutes.js` for security.

---

### 5 — Start the frontend

```bash
cd frontend
npm run dev
```

Vite will open: **http://localhost:5173**

---

### 6 — Log in as admin

1. Go to **http://localhost:5173/admin/login**
2. Enter the email + password from your `.env`
3. You'll land on the dashboard — create your first post!

---

## 🌐 API Reference

### Auth Routes (`/api/auth`)

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/login` | Public | Login with email + password → returns JWT |
| `GET`  | `/me` | Private | Get logged-in admin profile |
| `POST` | `/seed` | Dev only | Create the admin user |

### Post Routes (`/api/posts`)

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `GET`  | `/` | Public | List published posts (paginate, filter, search) |
| `GET`  | `/categories` | Public | Get all unique categories |
| `GET`  | `/:slug` | Public | Get single post by slug |
| `GET`  | `/admin/all` | Private | All posts including drafts |
| `GET`  | `/admin/:id` | Private | Single post by MongoDB ID |
| `POST` | `/` | Private | Create post |
| `PUT`  | `/:id` | Private | Update post |
| `DELETE` | `/:id` | Private | Delete post |
| `POST` | `/upload-image` | Private | Upload featured image |

#### Query params for `GET /api/posts`:
```
?page=1       Pagination page (default: 1)
?limit=6      Items per page (default: 10)
?category=    Filter by category
?search=      Search title + excerpt
```

---

## 🔐 Authentication Flow

```
Admin → POST /api/auth/login
      ← { token: "eyJ..." }

Frontend stores token in localStorage
Every request: Authorization: Bearer <token>

Axios interceptor auto-attaches token.
On 401 response → clears token → redirects to /admin/login
```

---

## 🖼️ Image Upload

Currently uses **local disk storage** via Multer.  
Uploaded images are served at `http://localhost:5000/uploads/<filename>`.

### Switching to Cloudinary (production)

1. Add Cloudinary credentials to `backend/.env`
2. In `backend/controllers/postController.js`, replace the `uploadImage` handler:

```js
const { cloudinary } = require("../config/cloudinary");

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new Error("No file provided");
  
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "blog",
    transformation: [{ width: 1200, crop: "limit" }],
  });
  
  res.json({ success: true, data: { url: result.secure_url } });
});
```

---

## 🏗️ Production Build

### Frontend

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

Serve `dist/` with Nginx or deploy to **Netlify / Vercel**.

### Backend

Set these in production `.env`:
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...  # Atlas URI
JWT_SECRET=<long-random-string>
FRONTEND_URL=https://yourblog.com
```

Deploy to **Railway / Render / DigitalOcean / Fly.io**.

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Tailwind CSS |
| Editor | React Quill (WYSIWYG) |
| State | React Context API + hooks |
| HTTP | Axios with request/response interceptors |
| Notifications | react-hot-toast |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer (local) / Cloudinary (production) |
| Dev Tools | Nodemon, Vite HMR |

---

## 🔧 Common Issues

**MongoDB connection fails:**  
→ Make sure MongoDB is running: `mongod --dbpath /data/db`  
→ Or use MongoDB Atlas and update `MONGO_URI`

**CORS errors:**  
→ Ensure `FRONTEND_URL` in backend `.env` matches your Vite dev URL (`http://localhost:5173`)

**Quill CSS not loading:**  
→ Make sure `import "react-quill/dist/quill.snow.css"` is in `PostForm.jsx` ✅

**Token expired — can't access admin:**  
→ Log out and log in again. Token lifetime is controlled by `JWT_EXPIRES_IN` in `.env`

---

## 📄 License

MIT — use freely for personal or commercial projects.
