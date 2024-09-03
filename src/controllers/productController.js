import Products from "../models/Products.js";
import cloudinary from "../utils/cloudinary.js";

const validateProductData = (data) => {
    const { name, description, price, category, brand, inventory, images } = data;
    if (!name || !description || !price || !category || !brand || !inventory || !images) {
        return "All fields are required";
    }
    return null;
};

// ดึงสินค้าทั้งหมด
const getAllProducts = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    try {
        let query = Products.find().sort({ createdAt: -1 });

        if (limit) {
            query = query.limit(limit);
        }

        const products = await query.exec(); // ใช้ .exec() เพื่อให้คำค้นหาเสร็จสิ้น

        return res.json({ error: false, products });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// ดึงสินค้าตาม ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Products.findById(id); // ใช้ Products แทน Product
        if (!product) {
            return res.status(404).json({ error: true, message: "Product not found" });
        }
        return res.json({ error: false, product });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// สร้างสินค้าใหม่
const createProduct = async (req, res) => {
    const validationError = validateProductData(req.body);
    if (validationError) {
        return res.status(400).json({ error: true, message: validationError });
    }

    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: true, message: "No file uploaded" });
    }

    try {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });

        const newProduct = new Products({
            ...req.body,
            images: {
                public_id: result.public_id,
                url: result.secure_url,
            },
            addBy: req.user.name,
        });

        await newProduct.save();

        return res.status(201).json({ error: false, product: newProduct, message: "Product created successfully" });
    } catch (error) {
        console.error("Error creating product:", error.message);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// อัพเดตสินค้า
const updateProduct = async (req, res) => {
    const { id } = req.params;

    const validationError = validateProductData(req.body);
    if (validationError) {
        return res.status(400).json({ error: true, message: validationError });
    }

    try {
        const product = await Products.findOne({ _id: id, addBy: req.user._id }); // ใช้ Products แทน Product
        if (!product) {
            return res.status(404).json({ error: true, message: "Product not found" });
        }

        Object.assign(product, req.body);  // ใช้ Object.assign แทนการตั้งค่าทีละฟิลด์

        await product.save();

        return res.json({ error: false, product, message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error.message);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};
// ลบสินค้า
const deleteProduct = async (req, res) => {
    const user = req.user;
    const { productId } = req.params;

    try {
        const product = await Product.findOne({ _id: productId, addBy: user.id });
        if (!product) {
            return res
                .status(404)
                .json({ error: true, message: "Product not found" });
        }

        await Product.findByIdAndDelete(productId);

        return res.json({
            error: false,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

// ค้นหาสินค้า
const searchProducts = async (req, res) => {
    const { query } = req.query;

    try {
        if (!query) {
            return res.status(400).json({ error: true, message: "Query is required" });
        }

        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        });

        return res.json({ error: false, products, message: "Search success" });

    } catch (error) {
        console.error("Error searching products:", error.message);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};


const productController = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
};

export default productController;