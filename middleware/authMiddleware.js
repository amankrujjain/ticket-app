// This is the middleware that checks the role of loggedin user

const jwt = require("jsonwebtoken");
const Role = require("../model/roleModel");

const authMiddleware = (roles = [])=>{
    return async(req,res,next)=>{

        // Taking token from the cookies

        const token = req.cookies.token;

        // if token doesn't exists

        if(!token){
            return res.status(401).json({
                success: false,
                message:"Access denied. No valid token found"
            });
        };

        // verifying the token

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // fetching the user's role details

            const role = await Role.findById(req.user.role);

            if(!role){
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Role not found."
                });
            }

            if(roles.length && !roles.includes(role.name)){
                return res.status(403).json({
                    success: false,
                    message:"Forbidden: Your do not have access to this resource"
                })
            };
            next();
        } catch (error) {
            // console.log("Invalid token error:", error)
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            });
        };
    };
};

module.exports = authMiddleware;