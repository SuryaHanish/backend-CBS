"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const compression_1 = __importDefault(require("compression"));
const db_1 = __importDefault(require("./utils/db"));
const error_1 = __importDefault(require("./middleware/error"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const topic_routes_1 = __importDefault(require("./routes/topic.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const subject_routes_1 = __importDefault(require("./routes/subject.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Enable trust proxy to allow rate limiting to work with real client IP
app.set('trust proxy', true);
// Validate environment variables
if (!process.env.FRONTEND_URL || !process.env.PORT) {
    throw new Error('Missing required environment variables.');
}
// Connect to the database
(0, db_1.default)();
// Set up middleware
app.use(express_1.default.json());
app.use((0, compression_1.default)()); // Compress response bodies for improved performance
app.use((0, helmet_1.default)()); // Set security headers
app.use((0, express_mongo_sanitize_1.default)()); // Prevent NoSQL injection
// Set up rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `windowMs`
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter); // Apply to all requests
// Set up CORS
const allowedOrigins = process.env.FRONTEND_URL
    ? JSON.parse(process.env.FRONTEND_URL) // Parse array of URLs from env variable
    : ['http://localhost:3000', 'https://testing-cbs.vercel.app']; // Default to these URLs if not set
console.log('Allowed Origins:', allowedOrigins); // Log to check
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // If the origin is not provided or is in the allowed list, accept the request
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
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
app.use("/api", blog_routes_1.default);
app.use("/api", topic_routes_1.default);
app.use("/api", category_routes_1.default);
app.use("/api", subject_routes_1.default);
// Error handling middleware
app.use(error_1.default);
exports.default = app;
