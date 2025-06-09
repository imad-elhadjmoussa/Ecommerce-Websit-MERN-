const Order = require('../models/order.model');
const User = require('../models/user.model');

const placeOrder = async (req, res) => {
    try {
        const user = req.user;
        const { address, phone } = req.body;

        if (
            !address ||
            !address.street ||
            !address.city ||
            !address.postalCode ||
            !address.country
        ) {
            return res.status(400).json({ message: 'Complete address is required' });
        }

        if (!phone || phone.trim() === '') {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const dbUser = await User.findById(user._id);
        if (!dbUser || !Array.isArray(dbUser.cartData) || dbUser.cartData.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or user not found' });
        }

        const items = dbUser.cartData;
        const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

        const newOrder = new Order({
            userId: dbUser._id,
            items,
            totalAmount,
            address,
            phone
        });

        await newOrder.save();

        dbUser.cartData = [];
        await dbUser.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const user = req.user;
        const orders = await Order.find({ userId: user._id })
        console.log(orders);

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    placeOrder,
    getUserOrders
};
