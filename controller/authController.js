const User = require("../model/userModel");
const Centre = require("../model/centreModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const Role = require("../model/roleModel");

const generateToken = (user)=>{
    return jwt.sign({id: user._id, role:user.role._id}, process.env.JWT_SECRET,{
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
        const {name, email, password, employee_id, phone, role, centre} = req.body;

        // console.log("Body:", req.body)

        const user = await User.findOne({
            $or: [{email: email}, {employee_id: employee_id}]
        });

        if(user){
            return res.status(409).json({
                success:false,
                message:"User already exits."
            });
        };

        // Finding the role of the user

        const roleObj = await Role.findOne({name:role});
        if(!roleObj){
            return res.status(404).json({
                success: false,
                message:"Invalid role provided"
            })
        };
        const centreObj = await Centre.findById(centre).populate('city').populate('state');
        if (!centreObj) {
            return res.status(400).json({
                success: false,
                message: "Invalid centre provided.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            email,
            phone,
            employee_id,
            centre: centreObj,
            password:hashedPassword,
            role: roleObj._id
        });
        await newUser.save();
        await newUser.populate('role')
        return res.status(201).json({
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
        }).populate('role').populate({
            path: 'centre',
            populate: [
                { path: 'state' },
                { path: 'city' }
            ]
        });

        // console.log("User role:", user.role)

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
        user.is_logged_in = true;
        await user.save()
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
                phone:user.phone,
                name: user.name,
                email:user.email,
                employee_id: user.employee_id,
                role: user.role,
                centre: user.centre,
                token: token,
                is_logged_in: user.is_logged_in
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

const logoutUser = async (req, res) => {
    try {

        const userId = await req.user.id
        // Clear the token cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Same settings as when the token is set
            sameSite: 'Strict',
            path:'/'
        });

        await User.findByIdAndUpdate(userId, {is_logged_in: false})

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.log("Error during logout:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging out"
        });
    }
};


// Protected profile route

const getProfile = async(req,res) =>{
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password").populate("role").populate({
            path: "centre",
            populate: [
                { path: "state" },
                { path: "city"}
            ]
        });;

        if(!user){
            return res.status(404).json({
                success:false,
                message:"No valid user found"
            });
        };

        return res.status(200).json({
            success:true,
            data: user
        })
    } catch (error) {
        console.log("Error while fetching profile:", error);
        return res.status(500).json({
            success: false,
            message:"An error occured while fetching the profile"
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser
}