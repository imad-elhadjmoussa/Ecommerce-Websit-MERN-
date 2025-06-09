require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongoose');
const connectCloudinary = require('./config/cloudinary');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const googleAuthRoutes = require('./routes/google_auth.route');
const productRoutes = require('./routes/product.route');
const cartRoutes = require('./routes/cart.route'); // Uncomment if you have cart routes
const orderRoutes = require('./routes/order.route'); // Uncomment if you have order routes
const userRoutes = require('./routes/user.route'); // Uncomment if you have user routes

const app = express();
const port = process.env.PORT ;



// Middleware
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
    },
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());
const allowedOrigins = [
    "https://ecommerce-websit-mern.onrender.com",           // e.g., http://localhost:5173
    process.env.ADMIN_DASHBOARD_CLIENT_URL,    // Add as many as needed
];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

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
