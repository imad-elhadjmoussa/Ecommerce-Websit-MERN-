
const express = require('express');

const { placeOrder,getUserOrders } = require('../controllers/order.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = express.Router();

// Route to place an order
router.post('/place-order', isAuthenticated, placeOrder);
router.get("/", isAuthenticated, getUserOrders)


module.exports = router;