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

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'userId',
                select: 'email username',
                model: 'User'  // Changed to match the model name in user.model.js
            })
            .sort({ orderDate: -1 }); // Sort by newest first

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        console.log('Updating order status:', {
            orderId,
            status,
            user: req.user ? { id: req.user._id, email: req.user.email } : 'no user',
            body: req.body
        });

        // Validate status
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            console.error('Invalid status provided:', { 
                provided: status, 
                validStatuses 
            });
            return res.status(400).json({ 
                message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            console.error('Order not found:', { orderId });
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log('Found order:', { 
            orderId: order._id, 
            currentStatus: order.status,
            newStatus: status 
        });

        order.status = status;
        await order.save();

        console.log('Order status updated successfully');

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', {
            error: error.message,
            stack: error.stack,
            orderId: req.params.orderId,
            status: req.body.status
        });
        res.status(500).json({ 
            message: 'Server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
};
