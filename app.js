import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipesRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { router as savedRecipesRoutes } from './routes/savedRecipesRoutes.js';
import { authenticate } from './middleware/authenticate.js';
import logger from './config/logger.js';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

if (!process.env.JWT_SECRET) {
  logger.error("JWT_SECRET is missing in environment variables!");
  throw new Error("JWT_SECRET is missing in environment variables!");
}

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  'https://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    logger.info('Incoming Origin:', origin);
    if (!origin) {
      // Allow non-browser requests like curl or server-to-server calls
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    logger.warn(`Origin ${origin} not allowed by CORS`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type', 'Cache-Control', 'Origin', 'Accept'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

logger.info('Middlewares applied: CORS, Helmet, JSON Parser, Cookie Parser');

// Static file handling with proper CORS headers
app.use('/uploads', (req, res, next) => {
  // Set to your frontend origin for credentials to work
  const origin = req.get('Origin');
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', authenticate, profileRoutes);
app.use('/api/saved-recipes', authenticate, savedRecipesRoutes);

logger.info('Routes initialized');

// Error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    logger.warn('Validation error', { message: err.message });
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'UnauthorizedError' || err.message === 'Not allowed by CORS') {
    logger.warn('Unauthorized or CORS access attempt', { error: err.message });
    return res.status(401).json({ message: 'Unauthorized, please log in again' });
  }
  logger.error('Unhandled server error', { message: err.message, stack: err.stack });
  res.status(500).json({ message: 'Something went wrong. Please try again later.' });
});

// Token tester
app.post('/test-token', (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ decoded });
  } catch (err) {
    logger.warn('Invalid token test attempt', { error: err.message });
    res.status(403).json({ message: 'Invalid token' });
  }
});

app.get('/', (req, res) => {
  res.send('Savorly API is running!');
});

app.get('/test-origin', (req, res) => {
  const originHeader = req.get('Origin');
  logger.info('Received request from Origin:', originHeader);
  res.json({ origin: originHeader });
});

export default app;
