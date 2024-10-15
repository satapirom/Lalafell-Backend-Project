import Product from '../models/Products.js';
import cloudinary from '../utils/cloudinary.js';

// Admin only
const uploadProduct = async (req, res, next) => {
    try {
        console.log('Uploaded Files:', req.files);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: true, message: 'No images provided' });
        }

        const { name, description, price, quantity, category, brand, size } = req.body;

        // Check if the product already exists
        let product = await Product.findOne({ name, category, brand, size });

        let uploadedImages = [];

        if (!product) {
            // If product doesn't exist, upload images to Cloudinary
            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path, { folder: 'products' })
            );

            const results = await Promise.all(uploadPromises);
            console.log('Uploaded images:', results);

            uploadedImages = results.map(result => ({
                public_id: result.public_id,
                url: result.secure_url,
            }));
        }

        if (product) {
            // Update existing product
            product.quantity += parseInt(quantity, 10);
            await product.save();
            return res.json({ error: false, product, message: "Product updated successfully" });
        } else {
            // Create new product
            const newProduct = new Product({
                name,
                description,
                price: Number(price),
                quantity: Number(quantity),
                category,
                brand,
                size,
                images: uploadedImages,
            });

            await newProduct.save();
            return res.status(201).json({ error: false, product: newProduct, message: "Product created successfully" });
        }

    } catch (error) {
        console.error('Error processing product:', error);
        res.status(500).json({ error: true, message: error.message });
    }
};

// Admin and user
const getProducts = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

    try {
        // สร้างการค้นหาผลิตภัณฑ์ที่มีการเรียงลำดับตามวันที่สร้าง
        let query = Product.find().sort({ createdAt: -1 });

        // ถ้ามี limit ให้ใช้ limit
        if (limit) {
            query = query.limit(limit);
        }

        // ดึงข้อมูลผลิตภัณฑ์
        const products = await query.exec();

        return res.json({ error: false, products });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};
const getProductByID = async (req, res) => {
    const { id } = req.params;
    console.log('Received ID:', id);
    try {
        const product = await Product.findById(id);
        console.log('Product found:', product);
        if (!product) {
            return res.status(404).json({ error: true, message: 'Product not found' });
        }
        return res.json({ error: false, product });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const getProductFilter = async (req, res) => {
    const { limit, sort, size, category, page } = req.query;
    const limitNum = limit ? parseInt(limit, 10) : 10; // Default to 10 if limit is not provided
    const pageNum = page ? parseInt(page, 10) : 1; // Default to page 1 if page is not provided

    try {
        let query = Product.find();

        // Apply size filter if provided
        if (size) {
            if (typeof size !== 'string') {
                return res.status(400).json({ error: true, message: "Invalid size parameter" });
            }
            query = query.where('size').equals(size);
        }

        // Apply category filter if provided
        if (category) {
            if (typeof category !== 'string') {
                return res.status(400).json({ error: true, message: "Invalid category parameter" });
            }
            query = query.where('category').equals(category);
        }

        // Apply sorting
        switch (sort) {
            case 'price':
                query = query.sort({ price: 1 });
                break;
            case 'popularity':
                query = query.sort({ popularity: -1 });
                break;
            case 'newest':
                query = query.sort({ createdAt: -1 });
                break;
            default:
                query = query.sort({ createdAt: -1 });
        }

        // Apply pagination
        query = query.skip((pageNum - 1) * limitNum).limit(limitNum);

        // Execute the query
        const products = await query.exec();

        return res.json({ error: false, products });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const searchProducts = async (req, res) => {
    const { q: query } = req.query;
    try {
        if (!query) {
            return res.status(400).json({ error: true, message: 'Search query is required' });
        }

        console.log('Search Query:', query); // Log the search query for debugging

        const searchRegex = new RegExp(query, 'i');

        const products = await Product.find({
            $or: [
                { name: { $regex: searchRegex } },  // ค้นหาในชื่อสินค้า
                { category: { $regex: searchRegex } },
                { brand: { $regex: searchRegex } },
                { size: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ]
        }).limit(10);

        console.log('Products found:', products.length); // Log the number of found products

        return res.json({ error: false, products });
    } catch (error) {
        console.error("Error searching products:", error.stack); // Log the full error stack
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};


const productController = {
    uploadProduct,
    getProducts,
    getProductFilter,
    getProductByID,
    searchProducts
};

export default productController;
