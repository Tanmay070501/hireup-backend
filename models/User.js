const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    profilePic: {
        type: String,
    },
    profileCompleted: {
        type: Boolean,
        default: false,
    },
    approvedByAdmin: {
        type: Boolean,
        default: false,
    },
    resume: { type: String },
    name: { type: String },
    course: { type: String },
    collegeName: { type: String },
    tenthPercentage: { type: String },
    twelvethPercentage: { type: String },
    coursePercentage: { type: String },
    company: {
        type: mongoose.Types.ObjectId,
        ref: "Company",
    },
    position: {
        type: String,
    },
    jobCount: {
        type: Number,
        default: 0,
    },
    ban: { type: Boolean, default: false },
    banByPCell: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("User", UserSchema);
