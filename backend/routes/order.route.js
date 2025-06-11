const express = require('express');

const { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// User routes
router.post('/place-order', isAuthenticated, placeOrder);
router.get("/", isAuthenticated, getUserOrders);

// Admin routes
router.get("/admin/all", isAuthenticated, isAdmin, getAllOrders);
router.patch("/admin/:orderId/status", isAuthenticated, isAdmin, updateOrderStatus);

module.exports = router;