const mongoose = require("mongoose");
const EmailVerifyTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: "1h",
        index: true,
    },
});

module.exports = mongoose.model("EmailVerifyToken", EmailVerifyTokenSchema);
