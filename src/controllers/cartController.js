import Cart from "../models/Cart.js";
import Product from "../models/Products.js";

const cartController = {
    addToCart: async (req, res) => {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        try {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ error: true, message: "Product not found" });
            }

            let cart = await Cart.findOne({ user: userId });
            if (!cart) {
                cart = new Cart({ user: userId, items: [], totalAmount: 0, totalQuantity: 0 });
            }

            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({
                    product: productId,
                    quantity,
                    price: product.price
                });
            }

            const { totalAmount, totalQuantity } = calculateCartTotals(cart);
            cart.totalAmount = totalAmount;
            cart.totalQuantity = totalQuantity;

            await cart.save();
            await cart.populate('items.product');

            return res.json({
                error: false,
                cart,
                message: 'Item added to cart successfully'
            });
        } catch (error) {
            console.error(`Error in add to cart operation: ${error.message}`);
            return res.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    },

    getCart: async (req, res) => {
        const userId = req.user.id;

        try {
            const cart = await Cart.findOne({ user: userId }).populate('items.product');
            if (!cart) {
                return res.json({ error: false, cart: { items: [], totalAmount: 0, totalQuantity: 0 } });
            }

            return res.json({ error: false, cart });
        } catch (error) {
            console.error(`Error fetching cart: ${error.message}`);
            return res.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    },

    updateCart: async (req, res) => {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;

        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ error: true, message: "Cart not found" });
            }

            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                return res.status(404).json({ error: true, message: "Product not found in cart" });
            }

            const { totalAmount, totalQuantity } = calculateCartTotals(cart);
            cart.totalAmount = totalAmount;
            cart.totalQuantity = totalQuantity;

            await cart.save();
            await cart.populate('items.product');

            return res.json({
                error: false,
                cart,
                message: 'Cart updated successfully'
            });
        } catch (error) {
            console.error(`Error updating cart: ${error.message}`);
            return res.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    },

    removeFromCart: async (req, res) => {
        const { productId } = req.params;
        const userId = req.user.id;

        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ error: true, message: "Cart not found" });
            }

            // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex === -1) {
                return res.status(404).json({ error: true, message: "Product not found in cart" });
            }

            // ลบสินค้าจากรายการในตะกร้า
            cart.items.splice(itemIndex, 1); // ใช้ splice เพื่อลบรายการที่พบ

            // คำนวณยอดรวมและจำนวนสินค้าหลังจากลบ
            const { totalAmount, totalQuantity } = calculateCartTotals(cart);
            cart.totalAmount = totalAmount;
            cart.totalQuantity = totalQuantity;

            await cart.save(); // บันทึกข้อมูลตะกร้าลงฐานข้อมูล
            await cart.populate('items.product');

            return res.json({
                error: false,
                cart,
                message: 'Item removed from cart successfully'
            });
        } catch (error) {
            console.error(`Error removing item from cart: ${error.message}`);
            return res.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    },

    clearCart: async (req, res) => {
        const userId = req.user.id;
        const { productIds } = req.body;

        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ error: true, message: "Cart not found" });
            }

            // Remove selected items from the cart
            cart.items = cart.items.filter(item => !productIds.includes(item.product.toString()));

            // Recalculate total amount and quantity
            cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

            await cart.save();

            return res.json({
                error: false,
                message: 'Selected items cleared from cart successfully',
                cart
            });
        } catch (error) {
            console.error(`Error clearing selected items from cart: ${error.message}`);
            return res.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    }
};


function calculateCartTotals(cart) {
    let totalAmount = 0;
    let totalQuantity = 0;

    cart.items.forEach(item => {
        totalAmount += item.price * item.quantity;
        totalQuantity += item.quantity;
    });

    return { totalAmount, totalQuantity };
}

export default cartController;
