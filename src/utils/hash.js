import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.log("Error hashing password", error);
        throw error
    };
};

const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.log("Error comparing password", error);
        throw error
    };
};

export { hashPassword, comparePassword };