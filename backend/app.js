require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongoose');
const connectCloudinary = require('./config/cloudinary');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Render
app.use(cors({
    origin: ['https://ecommerce-websit-mern.onrender.com', process.env.CLIENT_URL].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Trust proxy - important for Render
app.set('trust proxy', 1);

// Request logging middleware
app.use((req, res, next) => {
    console.log('Incoming request:', {
        path: req.path,
        method: req.method,
        origin: req.headers.origin,
        cookie: req.headers.cookie ? 'present' : 'missing'
    });
    next();
});

// Session configuration for Render
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60, // 1 day
        autoRemove: 'native',
        touchAfter: 24 * 3600,
        crypto: {
            secret: process.env.SESSION_SECRET || 'secret'
        }
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true on Render
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
    },
    name: 'sessionId' // Change session cookie name
}));

// Initialize Passport and restore authentication state from session
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Session logging middleware
app.use((req, res, next) => {
    console.log('Session state:', {
        id: req.session?.id,
        hasUser: !!req.session?.user,
        hasPassportUser: !!req.user,
        cookie: req.session?.cookie,
        passportUser: req.user ? {
            id: req.user.id,
            email: req.user.email
        } : null
    });
    next();
});

// Custom middleware to attach user to request
const attachUser = require('./middlewares/attachUser');
app.use(attachUser);

// Routes
const googleAuthRoutes = require('./routes/google_auth.route');
const productRoutes = require('./routes/product.route');
const cartRoutes = require('./routes/cart.route');
const orderRoutes = require('./routes/order.route');
const userRoutes = require('./routes/user.route');

app.use('/api/auth', googleAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', session: !!req.session });
});

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});
