const express = require('express');

const { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Logging middleware for order status updates
router.post("/admin/:orderId/status", (req, res, next) => {
    console.log('Order status update request:', {
        orderId: req.params.orderId,
        status: req.body.status,
        user: req.user ? { id: req.user._id, email: req.user.email } : 'no user',
        headers: req.headers,
        origin: req.headers.origin,
        cookie: req.headers.cookie ? 'present' : 'missing'
    });
    next();
}, isAuthenticated, isAdmin, updateOrderStatus);

// User routes
router.post('/place-order', isAuthenticated, placeOrder);
router.get("/", isAuthenticated, getUserOrders);

// Admin routes
router.get("/admin/all", isAuthenticated, isAdmin, getAllOrders);

module.exports = router;