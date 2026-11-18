import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import heroSlideRoutes from './routes/heroSlideRoutes.js';
import trekRoutes from './routes/trekRoutes.js';
import whyChooseRoutes from './routes/whyChooseRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import aboutUsRoutes from './routes/aboutUsRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Modular Feature Routes
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/treks', trekRoutes);
app.use('/api/why-choose', whyChooseRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/about-us', aboutUsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blogs', blogRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    app: 'TrekToShikhar Backend API',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
