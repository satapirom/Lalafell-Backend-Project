import { verify } from '../utils/token.js';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
    try {
        console.log("Request Headers:", req.headers); // Debugging headers
        console.log("Request Body:", req.body); // Debugging body

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

        const user = await User.findById(decoded.user);
        if (!user) {
            return res.status(401).json({ error: true, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(`Authentication error: ${error.message}`);
        return res.status(401).json({ error: true, message: "Access denied" });
    }
};

export default authMiddleware;

