import { verify } from '../utils/token.js';
import User from '../models/User.js';

const adminAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ error: true, message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: true, message: "Token missing" });
        }

        const decoded = verify(token);
        if (!decoded || !decoded.user) {
            return res.status(401).json({ error: true, message: "Unable to authenticate" });
        }

        console.log("Decoded Token:", decoded); // เพิ่ม logging

        const user = await User.findById(decoded.user);
        if (!user) {
            return res.status(401).json({ error: true, message: "User not found" });
        }

        console.log("User from DB:", user); // เพิ่ม logging

        if (!user.isAdmin) {
            return res.status(403).json({ error: true, message: "Access denied: Admins only" });
        }
        true
        req.user = user;
        next();
    } catch (error) {
        console.error(`Authentication error: ${error.message}`);
        return res.status(401).json({ error: true, message: "Authorization error" });
    }
};

export default adminAuthMiddleware;
