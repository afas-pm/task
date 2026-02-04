import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 4000;

//MIDDLEWARE
// capture raw body for debugging malformed JSON and still parse JSON
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf && buf.toString(); } }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// JSON parse error handler (body-parser)
app.use((err, req, res, next) => {
    if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Invalid JSON received:', err.message);
        if (req.rawBody) console.error('Raw body:', req.rawBody);
        return res.status(400).json({ success: false, message: 'Invalid JSON' });
    }
    next(err);
});

//DB CONNECTION
connectDB();

// Compatibility redirect for legacy client requests that hit /api/:id/gp
// If the :id looks like a Mongo ObjectId (24 hex chars) redirect (307) to /api/tasks/:id/gp
app.use('/api/:id/gp', (req, res, next) => {
    const { id } = req.params;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.redirect(307, `/api/tasks/${id}/gp`);
    }
    next();
});

//ROUTES
// Handle both /api/user AND /user (for Vercel serverless functions)
app.use('/api/user', userRouter);
app.use('/user', userRouter);

// Handle both /api/tasks AND /tasks
app.use('/api/tasks', taskRouter);
app.use('/tasks', taskRouter);

// Serve Static Assets & SPA Fallback
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// Root route for API health check
app.get('/', (req, res) => {
    res.send('TaskFlow API is running...');
});

// Serve frontend for all non-API routes (SPA Fallback)
app.get(/^(?!\/api).*/, (req, res) => {
    const indexPath = process.env.NODE_ENV === 'production'
        ? path.resolve(__dirname, '../frontend/dist/index.html')
        : path.resolve(__dirname, '../frontend/index.html');

    // In dev, if the dist isn't built, this might fail, so we check existence
    if (!fs.existsSync(indexPath)) {
        return res.send('Frontend not built. Please run "npm run build" in frontend folder or use port 5173 for development.');
    }
    res.sendFile(indexPath);
});

// Start server only if not running on Vercel (serverless)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless functions
export default app;