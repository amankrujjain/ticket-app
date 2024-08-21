const User = require("../model/userModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const generateToken = (user)=>{
    return jwt.sign({id: user._id, role:user.role}, process.env.JWT_SECRET,{
        expiresIn:'2h',
    })
}


const registerUser = async(req,res)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                message: "validation errors",
                error: errors.array()
            });
        };
        const {name, email, password, employee_id, phone, role} = req.body;

        const user = await User.findOne({
            $or: [{email: email}, {employee_id: employee_id}]
        });

        if(user){
            return res.status(409).json({
                success:false,
                message:"User already exits."
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            email,
            phone,
            employee_id,
            password:hashedPassword,
            role
        });
        await newUser.save();
        return res.status(200).json({
            success: true,
            message:"Registered successfully",
            data: newUser
        })

    } catch (error) {
        console.log("error occured due to:",error)
        return res.status(400).json({
            success:false,
            message: error.message
        })
    }
}

// Login

const loginUser = async (req,res)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                message: "validation failed",
                errors:errors.array()
            })
        };

        const {identifier, password} = req.body;

        const user = await User.findOne({
            $or: [{email:identifier}, {employee_id: identifier}]
        });

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid Employee ID/ Email or password"
            });
        };

        // Matching the password

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid employee ID/email or password"
            });
        };

        // generating token if user is found or logged in with correct credentials
        const token = generateToken(user);

        // setting token in cookies
        res.cookie("token", token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || true, //Checking it to true when on production
            maxAge: 2 * 60 * 60* 1000, // 2hours
        });

        return res.status(200).json({
            success: true,
            message: "LoggedIn successfully",
            user:{
                id: user._id,
                name: user.name,
                email:user.email,
                employee_id: user.employee_id,
                role: user.role,
                token: token
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:" An error occured while processing your request",
        });
    };
};

module.exports = {
    registerUser,
    loginUser
}