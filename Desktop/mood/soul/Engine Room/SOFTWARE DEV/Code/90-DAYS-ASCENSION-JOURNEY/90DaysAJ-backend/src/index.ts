import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { fileRoutes } from './routes/files';

dotenv.config();

const app = express();
// Use 5001 by default to avoid conflicts and permission issues
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '127.0.0.1';

// Security middleware
app.use(helmet());
// CORS configuration - allow common development ports (IPv4 + localhost)
const allowedOrigins = [
  process.env.APP_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173', // Vite default port
  'http://127.0.0.1:5173', // Vite default port (IPv4)
  'http://localhost:5174', // Vite fallback port
  'http://127.0.0.1:5174', // Vite fallback port (IPv4)
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/v1/auth', authRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/files', fileRoutes);

// Error handling
app.use(errorHandler);

app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

