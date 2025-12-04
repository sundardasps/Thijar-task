# Full-Stack API Backend + Frontend

A complete full-stack application with Node.js/Express backend and Vite/React frontend for user authentication, category management, and image upload with Cloudinary.

```
backend/     # Node.js/Express API
frontend/    # Vite/React frontend
```

## ✨ Features

**Backend:**
- 🔐 JWT Authentication (Register/Login with email/phone)
- 🏷️ Category CRUD (Admin only)
- 🖼️ Image Upload/Delete with Cloudinary
- 🛡️ Middleware security (auth, validation, CORS)
- 📊 Pagination for categories and products

**Frontend:**
- ⚛️ Modern React with Vite
- 📱 Responsive UI with Tailwind CSS
- 🔄 Real-time API integration
- 🖼️ Image upload preview
- 📋 Category management dashboard

## 🛠️ Tech Stack

| Backend | Frontend |
|---------|----------|
| Node.js, Express | React, Vite |
| MongoDB, Mongoose | Tailwind CSS |
| JWT Auth | Axios |
| Cloudinary | React Router |
| Joi Validation

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
MongoDB (local or Atlas)
Cloudinary account
```

### Clone & Install

```bash
git clone https://github.com/sundardasps/Thijar-task.git
cd fullstack-app
```

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env  # Configure backend env
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env  # Configure frontend env
npm run dev
```

## 🔧 Environment Variables

### Backend `.env`
```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/fullstack

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1d

# Cloudinary
CLOUDINARY_CLOUD_NAME=doxs8nqdr
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=your_folder
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api/
VITE_CLOUDINARY_CLOUD=doxs8nqdr
VITE_CLOUDINARY_PRESET=ojuymtsr
```

## 🌐 Running the App

```bash
# Terminal 1 - Backend
cd backend && npm run dev
# http://localhost:5000

# Terminal 2 - Frontend
cd frontend && npm run dev
# http://localhost:5173 (default Vite port)
```

## 📋 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register user | No |
| `POST` | `/auth/login` | Login | No |
| `GET` | `/auth/user` | Get profile | Yes |
| `POST` | `/categories` | Create category | Admin |
| `GET` | `/categories` | List categories | Yes |
| `PUT` | `/categories/:id` | Update category | Admin |
| `DELETE` | `/categories/:id` | Delete category | Admin |
| `POST` | `/cloudinary/upload` | Upload image | Yes |
| `POST` | `/cloudinary/delete` | Delete image | Yes |

## 🧪 Testing with Postman

Import provided collections in `backend/postman/` folder:
- `auth-api.postman_collection.json`
- `category-api.postman_collection.json`
- `cloudinary-api.postman_collection.json`

**Postman Environment:**
```
baseUrl: http://localhost:5000/api
token: <your-jwt-token>
categoryId: <category-mongo-id>
```

## 🏗️ Project Structure

```
fullstack-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── validation/
│   ├── postman/     # Postman collections
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   │  
│   └── .env
└── README.md
```

## 🔄 Development Scripts

```bash
# Backend
cd backend
npm run dev      # Nodemon development
npm start        # Production
npm run lint     # ESLint

# Frontend
cd frontend
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## ⚠️ CORS Configuration

**Backend CORS allows:** `http://localhost:5173` (Vite default)

**Postman Testing:**
- Add `Origin: http://localhost:3000` header
- Backend responds with proper CORS headers

## 📱 Frontend Features

- 🧑‍💻 User dashboard with profile
- 🏷️ Category management (admin view)
- 🖼️ Image upload with preview
- 📊 Paginated category list
- 🔐 Protected routes

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS blocked | Add `Origin` header in Postman or update `FRONTEND_URL` |
| MongoDB connection | Check `MONGODB_URI` format |
| Cloudinary upload | Verify credentials in both backend/frontend `.env` |
| JWT 401 | Copy token from login response |
| Vite proxy issues | Check `VITE_API_URL` matches backend port |

## 🚀 Production Deployment

```bash
# Backend: Render, Railway, or VPS + PM2
# Frontend: Vercel, Netlify, or Vite build to backend public/

# Build frontend
cd frontend
npm run build
# Copy dist/ to backend public/
```

## 🤝 Contributing

1. Fork the project
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add: AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Express.js & Vite communities
- Cloudinary CDN
- MongoDB & Mongoose
- Tailwind CSS

***

**⭐ Star this repo if it helps!** 🚀
