import Paymethod from "../models/PaymentMethod.js";
import User from "../models/User.js";
import crypto from 'crypto';

// Middleware for validating payment methods
const validatePayMethod = async (req, res, next) => {
    console.log('Request Body for Validation:', req.body);
    if (!req.body) {
        return res.status(400).json({ error: true, message: "Request body is missing" });
    }

    const { type, cardNumber, expiryDate, bankName, accountNumber, accountHolderName } = req.body;

    if (!type) {
        return res.status(400).json({ error: true, message: "Type is required" });
    }

    if (type === "Credit Card") {
        if (!cardNumber || !expiryDate) {
            return res.status(400).json({ error: true, message: "Card number and expiry date are required for credit card payments" });
        }
        if (!/^[0-9]{13,19}$/.test(cardNumber)) {
            return res.status(400).json({ error: true, message: "Invalid card number format" });
        }
        if (new Date(expiryDate) < new Date()) {
            return res.status(400).json({ error: true, message: "Expiry date must be in the future" });
        }
    }

    if (type === "Bank Account") {
        if (!bankName || !accountNumber || !accountHolderName) {
            return res.status(400).json({ error: true, message: "Bank name, account number, and account holder are required for bank account payments" });
        }
    }
    next();
};


const createPayMethod = async (req, res) => {
    console.log('Request Body:', req.body);

    const { type, cardNumber, expiryDate, bankName, accountNumber, accountHolderName } = req.body;

    if (!type) {
        return res.status(400).json({ error: true, message: "Type is required." });
    }

    try {
        const userId = req.user._id;
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: true, message: `User with ID ${userId} not found` });
        }

        const payMethodExists = await Paymethod.findOne({
            type,
            cardNumber,
            expiryDate,
            bankName,
            accountNumber,
            accountHolderName,
            user: userId
        });

        if (payMethodExists) {
            return res.status(400).json({ error: true, message: "Payment method already exists" });
        }

        const getLastFourDigits = (cardNumber) => {
            return cardNumber.slice(-4);
        }

        // Encrypt card number before saving
        const encryptCardNumber = (cardNumber) => {
            const encryptionKey = process.env.ENCRYPTION_KEY;

            if (!encryptionKey) {
                throw new Error('ENCRYPTION_KEY is not defined');
            }
            const key = crypto.scryptSync(encryptionKey, 'salt', 32);
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

            let encrypted = cipher.update(cardNumber, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            return { encryptedData: encrypted, iv: iv.toString('hex') };
        };

        // Encrypt the card number if it's a credit card
        const { encryptedData, iv } = type === 'Credit Card' ? encryptCardNumber(cardNumber) : { encryptedData: undefined, iv: undefined };

        const newPayMethod = new Paymethod({
            type,
            cardNumber: type === 'Credit Card' ? encryptedData : undefined,
            lastFourDigits: type === 'Credit Card' ? getLastFourDigits(cardNumber) : undefined,
            expiryDate: type === 'Credit Card' ? expiryDate : undefined,
            bankName: type === 'Bank Account' ? bankName : undefined,
            accountNumber: type === 'Bank Account' ? accountNumber : undefined,
            accountHolderName: type === 'Bank Account' ? accountHolderName : 'Credit Card',
            user: userId,
            iv: type === 'Credit Card' ? iv : undefined, // Store IV if it's a credit card
        });

        const savedPayMethod = await newPayMethod.save();
        return res.json({
            error: false,
            payMethod: {
                ...savedPayMethod.toObject(),
                cardNumber: undefined,  // Do not send back full card number
                lastFourDigits: savedPayMethod.lastFourDigits  // Only send back the last four digits
            }
        });

    } catch (error) {
        console.error(`Error creating payment method: ${error.message}`, error);
        return res.status(500).json({ error: true, message: `Internal Server Error: ${error.message}` });
    }
};




const updatePayMethod = async (req, res) => {
    const { id } = req.params;
    const { type, cardNumber, expiryDate, bankName, accountNumber, accountHolderName } = req.body;

    try {
        const payMethod = await Paymethod.findById(id);
        if (!payMethod) {
            return res.status(404).json({ error: true, message: "Payment method not found" });
        }

        // Update common fields
        payMethod.type = type || payMethod.type;

        // Update card-specific fields if the type is 'Credit Card'
        if (payMethod.type === 'Credit Card') {
            payMethod.cardNumber = cardNumber || payMethod.cardNumber;
            payMethod.expiryDate = expiryDate || payMethod.expiryDate;
            // Remove billing address update
        }

        // Update bank-specific fields if the type is 'Bank Account'
        if (payMethod.type === 'Bank Account') {
            payMethod.bankName = bankName || payMethod.bankName;
            payMethod.accountNumber = accountNumber || payMethod.accountNumber;
            payMethod.accountHolderName = accountHolderName || payMethod.accountHolderName;
        }

        const updatedPayMethod = await payMethod.save();
        return res.json({ error: false, message: "Payment method updated successfully", data: updatedPayMethod });
    } catch (error) {
        console.error(`Error updating payment method: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Get all payment methods for the user
const getPayMethods = async (req, res) => {
    try {
        const payMethods = await Paymethod.find({ user: req.user._id }).populate('user');

        const formattedPayMethods = payMethods.map(payMethod => {
            const baseInfo = {
                _id: payMethod._id, // Include _id in the response
                type: payMethod.type,
                accountHolderName: payMethod.accountHolderName,
            };

            if (payMethod.type === 'Credit Card') {
                return {
                    ...baseInfo,
                    lastFourDigits: payMethod.lastFourDigits,
                    expiryDate: payMethod.expiryDate,
                };
            } else if (payMethod.type === 'Bank Account') {
                return {
                    ...baseInfo,
                    bankName: payMethod.bankName,
                    accountNumber: payMethod.accountNumber,
                };
            }
        });

        return res.json({ error: false, payMethods: formattedPayMethods });
    } catch (error) {
        console.error(`Error getting payment methods: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Get a payment method by ID
const getPayMethodById = async (req, res) => {
    const { id } = req.params;

    try {
        const payMethod = await Paymethod.findById(id).populate('user');

        if (!payMethod) {
            return res.status(404).json({ error: true, message: "Payment method not found" });
        }

        return res.json({ error: false, payMethod });
    } catch (error) {
        console.error(`Error getting payment method: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Delete a payment method by ID
const deletePayMethod = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;

    console.log('Received delete request for id:', id, 'with type:', type);

    if (!type) {
        return res.status(400).json({ error: true, message: "Type is required" });
    }

    try {
        const payMethod = await Paymethod.findById(id);
        if (!payMethod) {
            return res.status(404).json({ error: true, message: "Payment method not found" });
        }

        if (payMethod.type !== type) {
            return res.status(400).json({ error: true, message: "Type mismatch" });
        }

        await Paymethod.deleteOne({ _id: id });
        return res.json({ error: false, message: "Payment method deleted successfully" });
    } catch (error) {
        console.error(`Error deleting payment method: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};
// Exports for router
const paymentMethodController = {
    createPayMethod,
    getPayMethods,
    getPayMethodById,
    updatePayMethod,
    deletePayMethod,
    validatePayMethod,
};

export default paymentMethodController;

