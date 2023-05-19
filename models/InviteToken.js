const mongoose = require("mongoose");
const InviteTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    company: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Company",
    },
});

module.exports = mongoose.model("InviteToken", InviteTokenSchema);
