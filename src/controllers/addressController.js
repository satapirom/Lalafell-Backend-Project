import Address from "../models/Address.js";
import User from "../models/User.js";

const ValidateAddress = (data) => {
    const { name, phone, street, city, country, state, postalCode } = data;
    if (!name || !phone || !street || !city || !state || !country || !postalCode) {
        return "All fields are required";
    }
    return null;
};

const createAddress = async (req, res) => {
    const validationError = ValidateAddress(req.body);
    if (validationError) {
        return res.status(400).json({ error: true, message: validationError });
    }

    const { name, phone, street, city, state, country, postalCode, isDefault } = req.body;

    try {
        const userId = req.user._id;

        // If this address is marked as default, unset other default addresses
        if (isDefault) {
            await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });
        }

        const newAddress = new Address({
            name,
            street,
            city,
            state,
            country,
            postalCode,
            phone,
            isDefault: !!isDefault,
            user: userId
        });

        const savedAddress = await newAddress.save();
        return res.status(201).json({ error: false, message: "Address created successfully", data: savedAddress });
    } catch (error) {
        console.error(`Error creating address: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const getUserAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id });
        return res.json({ error: false, addresses });
    } catch (error) {
        console.error(`Error getting user addresses: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const updateUserAddress = async (req, res) => {
    const { id } = req.params;
    const { name, street, city, state, country, postalCode, phone, isDefault } = req.body;

    console.log('Updating address:', id);
    console.log('Request body:', req.body);

    try {
        const addressToUpdate = await Address.findOne({ _id: id, user: req.user.id });

        if (!addressToUpdate) {
            console.log('Address not found:', id);
            return res.status(404).json({ error: true, message: "Address not found or you don't have permission to update it" });
        }

        const updatedAddress = await Address.findByIdAndUpdate(id, {
            name,
            street,
            city,
            state,
            country,
            postalCode,
            phone,
            isDefault
        }, { new: true });

        console.log('Updated address:', updatedAddress);

        return res.json({ error: false, message: "Address updated successfully", data: updatedAddress });
    } catch (error) {
        console.error(`Error updating user address: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const deleteUserAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const userId = req.user.id; // Assuming you have middleware that sets the user

        const address = await Address.findOne({ _id: addressId, user: userId });

        if (!address) {
            return res.status(404).json({ error: true, message: "Address not found or you don't have permission to delete it" });
        }

        await Address.findByIdAndDelete(addressId);
        res.json({ error: false, message: "Address deleted successfully" });
    } catch (error) {
        console.error(`Error deleting user address: ${error.message}`);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};


const addressController = {
    createAddress,
    getUserAddresses,
    updateUserAddress,
    deleteUserAddress
};
export default addressController;

