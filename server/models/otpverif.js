const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpverifSchema = new mongoose.Schema({
    username : String,
    otp : String,
    createdAt : Date,
    expiresAt : Date,
});
const otpverif = mongoose.model(
    "userOTPVerification",
    UserOTPVerificationSchema
);
module.exports = UserOTPVerification;
