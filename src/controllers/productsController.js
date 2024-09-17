import Product from '../models/Products.js';
import cloudinary from '../utils/cloudinary.js';

const uploadProduct = async (req, res, next) => {
    try {
        const { images } = req.body;

        // if (!name || !description) {
        //     return res.status(400).send('Name and description are required');
        // }

        if (!images || images.length === 0) {
            return res.status(400).send('No images provided');
        }

        // อัปโหลดรูปภาพไปยัง Cloudinary
        const uploadPromises = images.map(image =>
            cloudinary.uploader.upload(image, { folder: 'dropzone' })
        );

        const results = await Promise.all(uploadPromises);
        console.log('Uploaded images:', results);

        // บันทึกข้อมูลผลิตภัณฑ์ลง MongoDB
        const newProduct = new Product({
            // name,
            // description,
            images: results.map(result => ({
                public_id: result.public_id,
                url: result.secure_url
            }))
        });

        await newProduct.save();
        res.status(201).send({ message: 'Product uploaded successfully', product: newProduct });
    } catch (error) {
        console.error('Error uploading product:', error.message);
        next(error);
    }
};

export default { uploadProduct };

