const mongoose = require("mongoose");
const InviteTokenSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("InviteToken", InviteTokenSchema);
