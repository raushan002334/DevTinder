const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

// User Model
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLenght: 50,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email :" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong password :" + value);
        }
      },
    },
    age: {
      type: Number,
      required: false,
      min: 18,
    },
    gender: {
      type: String,
      required: false,
      trim: true,
      enum : { 
        values: ["male", "female", "others"],
        message: "{VALUE} is not supported for gender field" 
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Not a valid gender (Male , Female and other)");
      //   }
      // },
    },
    about: {
      type: String,
      // default: "Dev is in search for someone here",
    },
    photoURL: {
      type: String,
      default: "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1740779693~exp=1740783293~hmac=3ffc11733917c931bddeec957e8fa649e6a1590282b3210d816ccbf54dab2e94&w=900",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL :" + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  const token = await jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};  


module.exports = mongoose.model("User", userSchema);