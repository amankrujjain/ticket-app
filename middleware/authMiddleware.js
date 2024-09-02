const jwt = require("jsonwebtoken");
const Role = require("../model/roleModel");

const authMiddleware = (roles = []) => {
    return async (req, res, next) => {
        // Taking token from cookies or Authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        // If token doesn't exist
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No valid token found"
            });
        }

        // Verifying the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Fetching the user's role details
            const role = await Role.findById(req.user.role);

            if (!role) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Role not found."
                });
            }

            if (roles.length && !roles.includes(role.name)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have access to this resource"
                });
            }
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
    };
};

module.exports = authMiddleware;