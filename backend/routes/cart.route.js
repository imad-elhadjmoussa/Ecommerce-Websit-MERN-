
const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');


// Route to get the cart for a user
router.get('/', isAuthenticated, cartController.getCartByUserId);
// Route to add an item to the cart
router.post('/items', isAuthenticated, cartController.addItemToCart);

// Route to update an item in the cart
router.patch('/items/:itemId', isAuthenticated, cartController.updateCartItem);

// Route to remove an item from the cart
router.delete('/items/:itemId', isAuthenticated, cartController.removeItemFromCart);

// Route to clear the cart
// router.delete('/:userId', cartController.clearCart);

module.exports = router;