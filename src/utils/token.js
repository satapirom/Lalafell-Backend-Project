import jwt from "jsonwebtoken";
const sign = (payload) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        console.error("ACCESS_TOKEN_SECRET is not defined");
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    return jwt.sign(payload, secret, {
        expiresIn: "24h",
        algorithm: "HS256"
    });
};

const verify = (token) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        console.error("ACCESS_TOKEN_SECRET is not defined");
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    try {
        const decoded = jwt.verify(token, secret);
        console.log("Decoded Token", decoded); // Debugging decoded token
        return decoded;
    } catch (error) {
        console.error("Verify Token Error", error.message);
        return null;
    }
};

export { sign, verify };
