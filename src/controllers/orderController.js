import Order from "../models/Orders.js";
import Product from "../models/Products.js";

const validateOrderData = (data) => {
    const { items, totalAmount, shippingAddress, paymentMethod } = data;

    if (!items || !totalAmount || !shippingAddress || !paymentMethod) {
        return "All fields are required";
    }

    if (!Array.isArray(items) || items.length === 0) {
        return "Items must be a non-empty array";
    }

    return null;
};

const createOrder = async (req, res) => {
    const validationError = validateOrderData(req.body);
    if (validationError) {
        return res.status(400).json({ error: true, message: validationError });
    }

    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    // Log for debugging
    console.log('Shipping Address:', shippingAddress);
    console.log('Payment Method:', paymentMethod);

    try {
        // Check each item in the order
        for (const item of items) {
            const productData = await Product.findById(item.product);
            if (!productData) {
                return res.status(404).json({ error: true, message: "Product not found" });
            }
            if (productData.inventory < item.quantity) {
                return res.status(400).json({ error: true, message: "Insufficient inventory" });
            }
            productData.inventory -= item.quantity;
            await productData.save();
        }

        // Create a new order
        const newOrder = new Order({
            user: userId,
            items,
            totalAmount,
            status: 'pending',
            shippingAddress: shippingAddress, // Ensure this is an object
            paymentMethod: paymentMethod, // Ensure this is an object
        });

        const savedOrder = await newOrder.save();

        return res.status(201).json({ error: false, order: savedOrder, message: "Order created successfully" });
    } catch (error) {
        console.error(`Error creating order: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};



const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user')
            .populate('items.product');
        return res.json({ error: false, orders });
    } catch (error) {
        console.error(`Error getting orders: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(orderId)
            .populate('user')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ error: true, message: "Order not found" });
        }

        if (status) {
            order.status = status;
            await order.save();
        }

        return res.json({ error: false, order, message: "Order updated successfully" });
    } catch (error) {
        console.error(`Error updating order: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: true, message: "Order not found" });
        }

        if (status) {
            order.status = status;
            await order.save();
        }

        return res.json({ error: false, order, message: "Order updated successfully" });
    } catch (error) {
        console.error(`Error updating order: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

const deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: true, message: "Order not found" });
        }

        await Order.deleteOne({ _id: orderId });

        // Restore inventory for deleted order items
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { inventory: item.quantity }
            });
        }

        return res.json({ error: false, message: "Order deleted successfully" });
    } catch (error) {
        console.error(`Error deleting order: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const OrderController = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};

export default OrderController;


