const User = require('../model/userModel');

const fetchUsers = async(req,res)=>{
    try {
        const user = await User.find()
        .populate('role')
        .populate('centre');

        if(!user){
            return res.status(404).json({
                success: false,
                message:"Can't find user"
            });
        };

        return res.status(200).json({
            success:true,
            message: "request Successful",
            user: user
        })
    } catch (error) {
        console.log("Error while fetching all users:", error.message);
        return res.status(500).json({
            success: false,
            message:"Unexpected error occured while fetching user"
        })
    }
};

module.exports = {
    fetchUsers
}