import jwt from "jsonwebtoken";


export const generateJWTToken = async (user, message, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    });

    return res
        .status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            secure: process.env.NODE_ENV !== "development",
        })
        .json({
            success: true,
            message,
            token
        });
};
