# Task-Management

This repository contains a simple Task Management application with a Node/Express backend and a React + Tailwind frontend.

## Run locally

Backend

```bash
cd backend
npm install
npm run start
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

By default the frontend expects the backend API at `http://localhost:4000/api`. To change, create a `.env` file under `frontend` with:

```
VITE_API_URL=http://localhost:4000/api
```

## Features

- Register / Login (JWT)
- Tasks CRUD (Title, Description, Status)
- Protected routes
- Client-side validation and responsive UI (Tailwind)
- Toast notifications (react-toastify)
- Accessible modal confirm

## Notes

- Make sure MongoDB is running and `backend/config/db.js` is configured to connect.
- The backend uses environment variable `JWT_SECRET`.

*** End Patch