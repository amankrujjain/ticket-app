const Role = require("../model/roleModel");
const {validationResult} = require("express-validator");

const createRole = async (req,res)=>{
    try {

        // Checking the validatiion erros first

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                message:"Validation failed",
                errors: errors.array(),
            });
        };

        const {name} = req.body;
        const existingRole  = await Role.findOne({name, is_active: true});
        if(existingRole){
            return res.status(409).json({
                success:false,
                message:"Role already exists"
            });
        };

        const newRole = new Role({name});

        await newRole.save();

        return res.status(200).json({
            success:true,
            message:"Role successfully created",
            data: newRole
        })

    } catch (error) {
        console.log("Error occured:", error);

        return res.status(500).json({
            success: false,
            message:"A error occured while processing your request"
        });
    };
};


const getRoles = async (_,res)=>{
    try {
        const roles = await Role.find({is_active:true});
        return res.status(200).json({
            success:true,
            role: roles
        });
    } catch (error) {
        console.log("Error while fething role:",error);

        return res.status(500).json({
            success:false,
            message:"An error occured while fetching the roles",
        });
    };
};

// Deactivated roles

const getDeactivatedRoles = async (req,res)=>{
    try {
        const roles = await Role.find({is_active:false});
        return res.status(200).json({
            success:true,
            role: roles
        });
    } catch (error) {
        console.log("Error while fething role:",error);

        return res.status(500).json({
            success:false,
            message:"An error occured while fetching the roles",
        });
    };
};

const updateRole = async(req,res)=>{
    try {
        const {id} = req.params;
        const {name} = req.body;

        const role = await Role.findByIdAndUpdate(id,{name},{new:true});

        if(!role){
            return res.status(404).json({
                success: false,
                message:"Role not found"
            });
        };

        return res.status(200).json({
            success:true,
            message:"Role is updated successfully",
            role: role
        });
    } catch (error) {
        console.log("Error while updating role:",error);
        return res.status(500).json({
            success: false,
            message:"An error occured while updating role."
        })
    };
};

// const deleteRole

const deleteRole = async (req,res) => {
    try {
        const {id} = req.params;

        const role = await Role.findById(id);

        if(!role){
            return res.status(404).json({
                success: false,
                message:"Role not found."
            });
        };

        // checking whether the role is already deleted or not
        
        if(!role.is_active){
            return res.status(409).json({
                success: false,
                message: "Role already deleted"
            });
        };

        role.is_active = false;

        await role.save();
        
        return res.status(200).json({
            success:true,
            message:"Role deleted successfully",
            data: role
        });

    } catch (error) {
        console.log("Error while deleting role:", error);
        return res.status(500).json({
            success: false,
            message:"An error occured while deleteing the role."
        })
    }
}

module.exports = {
    createRole,
    getRoles,
    updateRole,
    getDeactivatedRoles,
    deleteRole
}