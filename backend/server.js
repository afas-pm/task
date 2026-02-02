import path from 'path';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';


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
app.use('/api/user', userRouter);
// mount tasks router at plural path so client requests to /api/tasks/* work
app.use('/api/tasks', taskRouter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});