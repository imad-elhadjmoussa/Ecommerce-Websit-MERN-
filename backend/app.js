require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongoose');
const connectCloudinary = require('./config/cloudinary');
const session = require('express-session');
const passport = require('passport');

const MongoStore = require('connect-mongo');
const app = express();

const allowedOrigins = [
    "https://ecommerce-websit-mern.onrender.com",           // e.g., http://localhost:5173
    process.env.ADMIN_DASHBOARD_CLIENT_URL,    // Add as many as needed
];

// app.use(cors({
//     origin: (origin, callback) => {
//         // allow requests with no origin (like mobile apps or curl requests)
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
// }));

app.use(cors({
    origin: 'https://ecommerce-websit-mern.onrender.com',
    credentials: true // This is crucial for sessions
}));

// Add this before session middleware
app.use((req, res, next) => {
    console.log('Incoming request path:', req.path);
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: true, // Changed to true to ensure session is saved
    saveUninitialized: true, // Changed to true to save new sessions
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60, // Session TTL in seconds (1 day)
        autoRemove: 'native', // Use native TTL index
        touchAfter: 24 * 3600 // time period in seconds
    }),
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    }
}));

// Add this after session middleware to log session state
app.use((req, res, next) => {
    console.log('Session after middleware:', {
        id: req.session?.id,
        hasUser: !!req.session?.user,
        hasPassportUser: !!req.user
    });
    next();
});

const googleAuthRoutes = require('./routes/google_auth.route');
const productRoutes = require('./routes/product.route');
const cartRoutes = require('./routes/cart.route'); // Uncomment if you have cart routes
const orderRoutes = require('./routes/order.route'); // Uncomment if you have order routes
const userRoutes = require('./routes/user.route'); // Uncomment if you have user routes

const port = process.env.PORT;



// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());




// Custom middleware to attach user to request
const attachUser = require('./middlewares/attachUser');
app.use(attachUser);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes); // Uncomment if you have order routes
app.use('/api/users', userRoutes); // Uncomment if you have user routes



// Connect to MongoDB
connectDB()
connectCloudinary();


app.listen(port, () => {
    // Connect to MongoDB
    console.log(`Server is running on ${port}`);
});
