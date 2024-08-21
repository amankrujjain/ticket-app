// This is the middleware that check if the logged in user is admin or not

const jwt = require("jsonwebtoken");

const authMiddleware = (roles = [])=>{
    return (req,res,next)=>{

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

            if(roles.length && !roles.includes(req.user.role)){
                return res.status(403).json({
                    success: false,
                    message:"Forbidden: Your do not have access to this resource"
                })
            };
            next();
        } catch (error) {
            return rs.status(401).json({
                success:false,
                message:"Invalid token"
            });
        };
    };
};

module.exports = authMiddleware;