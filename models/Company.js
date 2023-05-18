const mongoose = require("mongoose");
const CompanySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
    },
});

module.exports = mongoose.model("Company", CompanySchema);
