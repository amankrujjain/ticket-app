const {check} = require("express-validator");
const mongoose = require("mongoose")

exports.registerValidator = [
    check("name")
    .notEmpty().withMessage("Name is a required.")
    .isString().withMessage("Invalid name format"),

    check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

    check("phone")
    .notEmpty().withMessage("Phone is a mandatory field")
    .isNumeric().withMessage("Invalid phone format"),

    check("employee_id")
    .notEmpty().withMessage("Employee id is required"),

    check("password")
    .notEmpty().withMessage("Password is required")
    // .isLength({min:8}).withMessage("Password must be ate least 8 characters long")
    // .matches(/[A-Z]/).withMessage("Password must contain 1 uppercaase character")
    // .matches(/[a-z]/).withMessage("Password must contain 1 lowercase character")
    // .matches(/\d/).withMessage("Password must contain at least 1 number")
    // .matches(/^[ !@#\$%\^\&*\)\(+=._-]+$/g).withMessage("Password must contain 1 symbol")
];

exports.loginValidator = [
    check("identifier")
    .notEmpty().withMessage("Employee ID or Email is required"),
    check("password")
    .notEmpty().withMessage("Password is required")
    // .isLength({min:8}).withMessage("Password must be ate least 8 characters long")
    // .matches(/[A-Z]/).withMessage("Password must contain 1 uppercaase character")
    // .matches(/[a-z]/).withMessage("Password must contain 1 lowercase character")
    // .matches(/\d/).withMessage("Password must contain at least 1 number")
    // .matches(/^[ !@#\$%\^\&*\)\(+=._-]+$/g).withMessage("Password must contain 1 symbol")
];

exports.roleValidator = [
    check("name")
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Role name can only be alphabet")
];

exports.stateValidator = [
    check("name")
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Name can only  be alphabet")
];

exports.cityValidator = [
    check("name")
        .notEmpty().withMessage("City name is required")
        .isString().withMessage("Invalid city format"),

    check("state")
        .notEmpty().withMessage("State ID is required")
        .bail()
        .isString().withMessage("State ID must be a string")
        .bail()
        .custom(value => {
            // Check if the value is a valid 24-character hex string
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("State ID format invalid try to provide a valid format of tate ID");
            }
            return true;
        })
        .bail()
        .custom(value => {
            return mongoose.Types.ObjectId.isValid(value);
        }).withMessage("Invalid State ID")

];

exports.updateCityValidator = [
    check("name")
        .optional()
        .isString().withMessage("Invalid city format"),

    check("state")
        .optional()
        .isString().withMessage("State ID must be a string")
        .bail()
        .custom( value =>{
            if(!mongoose.Types.ObjectId.isValid(value)){
                throw new Error("State ID format invalid try to provide a valid format of state ID")
            }
        })
        .bail()
        .custom(value => {
            return mongoose.Types.ObjectId.isValid(value);
        }).withMessage("Invalid State ID")
];

exports.createCentreValidator = [
    check("name")
        .notEmpty().withMessage("Centre name is required")
        .isString().withMessage("Invalid centre name format"),

    check("state")
        .notEmpty().withMessage("State ID is required")
        .bail()
        .isString().withMessage("State ID must be a string")
        .bail()
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("State ID format is invalid. Please provide a valid ObjectId.");
            }
            return true;
        }),

    check("city")
        .notEmpty().withMessage("City ID is required")
        .bail()
        .isString().withMessage("City ID must be a string")
        .bail()
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("City ID format is invalid. Please provide a valid ObjectId.");
            }
            return true;
        }),

    check("district")
        .notEmpty().withMessage("District is required")
        .isString().withMessage("Invalid district format"),

    check("pincode")
        .notEmpty().withMessage("Pincode is required")
        .isString().withMessage("Pincode must be a string")
        .isLength({ min: 5, max: 6 }).withMessage("Pincode must be 5-6 digits long"),

    check("full_address")
        .notEmpty().withMessage("Full address is required")
];

exports.updateCentreValidator = [
    check("name")
        .optional()
        .isString().withMessage("Invalid centre name format"),

    check("state")
        .optional()
        .isString().withMessage("State ID must be a string")
        .bail()
        .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid State ID"),

    check("city")
        .optional()
        .isString().withMessage("City ID must be a string")
        .bail()
        .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid City ID"),

    check("district")
        .optional()
        .isString().withMessage("Invalid district format"),

    check("pincode")
        .optional()
        .isString().withMessage("Pincode must be a string")
        .isLength({ min: 5, max: 6 }).withMessage("Pincode must be 5-6 digits long"),

];

exports.createIssueValidator= [
    check("name")
    .isString().withMessage("Invalid issue name type")
    .notEmpty().withMessage("Issue name is mandetory")
];

exports.updateIssueValidator= [
    check("name")
    .isString().withMessage("Invalid issue name type")
    .notEmpty().withMessage("Issue name is mandetory")
];

exports.createReasonValidation = [
    check("name")
    .isString().withMessage("Invalid issue name type")
    .notEmpty().withMessage("Issue name is mandetory"),

    check("issue")
    .notEmpty().withMessage("issue ID is required")
    .bail()
    .isString().withMessage("Issue ID must be a string")
    .bail()
    .custom(value => {
        return mongoose.Types.ObjectId.isValid(value);
    }).withMessage("Invalid Issue ID"),

    check("tat")
    .isNumeric().withMessage("TAT should only be a number")
    .notEmpty().withMessage("TAT is required")
];

exports.machineValidator = [
    check("machine_serial_number").notEmpty().withMessage("Machine serial number is required."),
    check("purchase_from").notEmpty().withMessage("Purchase source is required."),
    check("centre")
    .notEmpty()
    .withMessage("Centre ID is required.")
    .custom(value => {
        return mongoose.Types.ObjectId.isValid(value);
    }).withMessage("Invalid Centre ID"),
];

exports.createTicketValidator = [
    check("reasonId")
        .notEmpty().withMessage("Reason ID is required")
        .isMongoId().withMessage("Invalid Reason ID"),
    check("machineId")
        .notEmpty().withMessage("Machine ID is required")
        .isMongoId().withMessage("Invalid Machine ID"),
];

exports.stageValidator = [
    check('name')
    .notEmpty().withMessage(" Stage name is required")
    .isString().withMessage("Stage name must be in alphabet format")
];

