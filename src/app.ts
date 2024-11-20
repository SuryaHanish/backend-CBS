import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import connectDB from './utils/db';
import errorMiddleware from './middleware/error';
import blogRoutes from "./routes/blog.routes";
import topicRoutes from './routes/topic.routes';
import categoryRoutes from './routes/category.routes';
import subjectRoutes from './routes/subject.routes';

dotenv.config();
const app = express();

// Enable trust proxy to allow rate limiting to work with real client IP
app.set('trust proxy', true);

// Validate environment variables
if (!process.env.FRONTEND_URL || !process.env.PORT) {
  throw new Error('Missing required environment variables.');
}

// Connect to the database
connectDB();

// Set up middleware
app.use(express.json());
app.use(compression()); // Compress response bodies for improved performance
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Prevent NoSQL injection

// Set up rate limiting
/*const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter); // Apply to all requests*/

// Set up CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? JSON.parse(process.env.FRONTEND_URL) // Parse array of URLs from env variable
  : ['http://localhost:3000', 'https://testing-cbs.vercel.app']; // Default to these URLs if not set

console.log('Allowed Origins:', allowedOrigins);  // Log to check

app.use(cors({
  origin: (origin, callback) => {
    // If the origin is not provided or is in the allowed list, accept the request
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true, // Allow credentials (cookies, etc.)
}));

// New home route for testing
app.get('/', (req, res) => {
  // Return a simple HTML div for testing
  res.send('<div>Home</div>');
});

// Define other routes
app.use("/api", blogRoutes);
app.use("/api", topicRoutes);
app.use("/api", categoryRoutes);
app.use("/api", subjectRoutes);

// Error handling middleware
app.use(errorMiddleware);

export default app;
