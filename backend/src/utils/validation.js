const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Please enter first name and last name");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter strong password");
    }
    else if(!validator.isEmail(emailId)) {
        throw new Error("Please enter valid email id");
    }
    
}

const validateEditProfileData = (req) => {
    const allowedEditFileds = ["firstName", "lastName", "emailId", "photoURL","gender", "age", "about", "skills"];
    const requestedEditFields = Object.keys(req.body);
    const isValidOperation = requestedEditFields.every((field) => allowedEditFileds.includes(field));

    if (!isValidOperation) {
        throw new Error("Invalid updates!");
    }
}
module.exports = {
    validateSignUpData,
    validateEditProfileData
};