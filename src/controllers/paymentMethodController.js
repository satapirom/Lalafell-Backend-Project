import Paymethod from "../models/PaymentMethod.js";
import User from "../models/User.js";


const validatePayMethod = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ error: true, message: "Request body is missing" });
    }

    const { type, cardNumber, expiryDate, billingAddress, user } = req.body;

    if (!type || !user) {
        return res.status(400).json({ error: true, message: "Type and user are required" });
    }

    if (type === "Credit Card") {
        if (!cardNumber || !expiryDate || !billingAddress) {
            return res.status(400).json({ error: true, message: "Card number, expiry date, and billing address are required for credit card payments" });
        }
        if (!/^[0-9]{13,19}$/.test(cardNumber)) {
            return res.status(400).json({ error: true, message: "Invalid card number format" });
        }
        if (new Date(expiryDate) < new Date()) {
            return res.status(400).json({ error: true, message: "Expiry date must be in the future" });
        }
    }
    next();
};

const createPayMethod = async (req, res) => {
    console.log('Request Body:', req.body); // เพิ่มการ logging เพื่อดูข้อมูล

    if (!req.body) {
        return res.status(400).json({ error: true, message: "Request body is missing" });
    }

    const { type, cardNumber, expiryDate, billingAddress, user } = req.body;

    try {
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ error: true, message: `User with ID ${user} not found` });
        }

        const payMethodExists = await Paymethod.findOne({ type, user });
        if (payMethodExists) {
            return res.status(400).json({ error: true, message: "Payment method already exists" });
        }

        const newPayMethod = new Paymethod({
            type,
            description: req.body.description,
            cardNumber,
            expiryDate,
            billingAddress,
            user
        });

        const savedPayMethod = await newPayMethod.save();
        return res.status(201).json({ error: false, message: "Payment method created successfully", data: savedPayMethod });

    } catch (error) {
        console.error(`Error creating payment method: ${error.message}`);
        return res.status(500).json({ error: true, message: `Internal Server Error: ${error.message}` });
    }
};

// ดึงรายการวิธีการชำระเงินทั้งหมด
const getPayMethods = async (req, res) => {
    try {
        const payMethods = await Paymethod.find()
            .populate('user'); // ดึงข้อมูลผู้ใช้
        return res.json({ error: false, payMethods });
    } catch (error) {
        console.error(`Error getting payment methods: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// ดึงวิธีการชำระเงินตาม ID
const getPayMethodById = async (req, res) => {
    const { payMethodId } = req.params;

    try {
        const payMethod = await Paymethod.findById(payMethodId)
            .populate('user'); // ดึงข้อมูลผู้ใช้

        if (!payMethod) {
            return res.status(404).json({ error: true, message: "Payment method not found" });
        }

        return res.json({ error: false, payMethod });
    } catch (error) {
        console.error(`Error getting payment method: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// อัปเดตวิธีการชำระเงินตาม ID
const updatePayMethod = async (req, res) => {
    const { payMethodId } = req.params;
    const { type, cardNumber, expiryDate, billingAddress } = req.body;

    try {
        // ตรวจสอบข้อมูลที่ได้รับ
        const validationError = validatePayMethod(req.body);
        if (validationError) {
            return res.status(400).json({ error: true, message: validationError });
        }

        const payMethod = await Paymethod.findById(payMethodId);
        if (!payMethod) {
            return res.status(404).json({ error: true, message: "Payment method not found" });
        }

        payMethod.type = type || payMethod.type;
        payMethod.cardNumber = cardNumber || payMethod.cardNumber;
        payMethod.expiryDate = expiryDate || payMethod.expiryDate;
        payMethod.billingAddress = billingAddress || payMethod.billingAddress;

        const updatedPayMethod = await payMethod.save();
        return res.json({ error: false, message: "Payment method updated successfully", data: updatedPayMethod });
    } catch (error) {
        console.error(`Error updating payment method: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// ลบวิธีการชำระเงินตาม ID
const deletePayMethod = async (req, res) => {
    const { payMethodId } = req.params;

    try {
        const payMethod = await Paymethod.findById(payMethodId);
        if (!payMethod) {
            return res.status(404).json({ error: true, message: "Payment method not found" });
        }

        await Paymethod.deleteOne({ _id: payMethodId });

        return res.json({ error: false, message: "Payment method deleted successfully" });
    } catch (error) {
        console.error(`Error deleting payment method: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const paymentMethodController = {
    createPayMethod,
    getPayMethods,
    getPayMethodById,
    updatePayMethod,
    deletePayMethod
};

export default paymentMethodController;
