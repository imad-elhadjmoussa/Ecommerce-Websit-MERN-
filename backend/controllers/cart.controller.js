const User = require("../models/user.model");

const addItemToCart = async (req, res) => {
    try {
        const user = req.user;
        const { _id, name, price, image, quantity, size } = req.body;

        const cartItem = {
            _id,
            name,
            price,
            image,
            quantity,
            size
        };

        // Load user
        const dbUser = await User.findById(user._id);
        if (!dbUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure cartData is an array
        if (!Array.isArray(dbUser.cartData)) {
            dbUser.cartData = [];
        }

        // Check if item with same product and size already exists
        const existingIndex = dbUser.cartData.findIndex(
            item => item._id.toString() === _id.toString() && item.size.toLowerCase() === size.toLowerCase()
        );

        if (existingIndex > -1) {
            dbUser.cartData[existingIndex].quantity += Number(quantity);
            dbUser.markModified('cartData');
        } else {
            dbUser.cartData.push(cartItem);
        }

        await dbUser.save();

        res.status(200).json({
            message: 'Product added to cart',
            cart: dbUser.cartData
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getCartByUserId = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('cartData');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            message: 'Cart retrieved successfully',
            cart: user.cartData
        });
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};



const updateCartItem = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const itemId = req.params.itemId;
        const { quantity } = req.body;

        const itemIndex = user.cartData.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update the quantity of the item
        user.cartData[itemIndex].quantity = quantity;

        await user.save();

        res.status(200).json({
            message: 'Cart item updated successfully',
            cart: user.cartData
        });

    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const removeItemFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const itemId = req.params.itemId;
        const itemIndex = user.cartData.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        user.cartData.splice(itemIndex, 1);
        await user.save();

        res.status(200).json({
            message: 'Item removed from cart',
            cart: user.cartData
        });

    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    addItemToCart,
    getCartByUserId,
    updateCartItem,
    removeItemFromCart
};