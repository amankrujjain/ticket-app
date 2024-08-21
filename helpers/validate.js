const {check} = require("express-validator");

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