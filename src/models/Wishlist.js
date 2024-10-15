import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const wishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: { // อ้างอิงสินค้าเป็นชิ้นเดียว
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true });

// สร้าง unique index เพื่อป้องกันการเพิ่มสินค้าซ้ำจากผู้ใช้คนเดียวกัน
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model('Wishlist', wishlistSchema);
