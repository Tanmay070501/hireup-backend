const mongoose = require("mongoose");
const JobPostSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    createdBy: {
        name: String,
        user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    applied: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    jobType: {
        type: String,
        default: "offcampus",
    },
    colleges: [{ type: String }],
    jobLocation: { type: String },
    salary: { type: String },
});

module.exports = mongoose.model("JobPost", JobPostSchema);
