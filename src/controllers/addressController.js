import Address from "../models/Address.js";
import User from "../models/User.js";

const ValidateAddress = (data) => {
    const { address, street, city, country, postalCode, phone } = data;
    if (!address || !street || !city || !country || !postalCode || !phone) {
        return "All fields are required";
    }
    return null;
};

const createAddress = async (req, res) => {
    const validationError = ValidateAddress(req.body);
    if (validationError) {
        return res.
            status(400).
            json({ error: true, message: validationError });
    }

    const { address, street, city, country, postalCode, phone } = req.body;

    try {
        const userExists = await User.findById(req.body.user);
        if (!userExists) {
            return res.status(404).json({
                error: true,
                message: `User with ID ${req.body.user} not found`
            });
        }

        const addressExists = await Address.findOne({ address, user: req.body.user });
        if (addressExists) {
            return res.status(400).json({
                error: true,
                message: "Address already exists"
            });
        }

        const newAddress = new Address({
            address,
            street,
            city,
            country,
            postalCode,
            phone,
            isDefault: false,
            user: req.body.user
        });

        const savedAddress = await newAddress.save();
        return res.
            status(201).
            json({ error: false, message: "Address created successfully", data: savedAddress });

    } catch (error) {
        console.error(`Error creating address: ${error.message}`)
        return res.
            status(500).
            json({ error: true, message: "Internal Server Error" });
    }
};

const getAddresses = async (req, res) => {
    const { userId } = req.params;
    try {
        const addresses = await Address.find({ user: userId });
        return res.json({ error: false, addresses });
    } catch (error) {
        console.error(`Error getting addresses: ${error.message}`);
        return res.
            status(500).
            json({ error: true, message: "Internal Server Error" });
    }
};

const getAddressesById = async (req, res) => {
    const { addressId } = req.params;
    try {
        const address = await Address.findById(addressId);

        if (!address) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }
        return res.json({ error: false, address });

    } catch (error) {
        console.error(`Error getting address: ${error.message}`);
        return res.
            status(500).
            json({ error: true, message: "Internal Server Error" });
    }
};

const updateAddress = async (req, res) => {
    const { addressId } = req.params;
    const { address, street, city, country, postalCode, phone, isDefault } = req.body;
    try {
        const updateAddress = await Address.findByIdAndUpdate(addressId, {
            address,
            street,
            city,
            country,
            postalCode,
            phone,
            isDefault
        }, { new: true });

        if (!updateAddress) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }

        return res.json({ error: false, message: "Address updated successfully", data: updateAddress });
    } catch (error) {
        console.error(`Error updating address: ${error.message}`);
        return res.
            status(500).
            json({ error: true, message: "Internal Server Error" });
    }
};

const deleteAddress = async (req, res) => {
    const { addressId } = req.params;
    try {
        const address = await Address.findByIdAndDelete(addressId);
        if (!address) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }
        return res.json({ error: false, message: "Address deleted successfully" });
    } catch (error) {
        console.error(`Error deleting address: ${error.message}`);
        return res.
            status(500).
            json({ error: true, message: "Internal Server Error" });
    }
};

const addressController = {
    createAddress,
    getAddresses,
    getAddressesById,
    updateAddress,
    deleteAddress
};
export default addressController;
