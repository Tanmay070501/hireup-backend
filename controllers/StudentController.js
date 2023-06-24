const mongoose = require("mongoose");
const User = require("../models/User");
const firebase = require("../utils/firebase");
const { uploadFile } = require("../utils/uploadFile");
const JobPost = require("../models/JobPost");

module.exports.createProfile = async (req, res, next) => {
    const {
        name,
        course,
        coursePercantage,
        tenthPercentage,
        twelvethPercentage,
        collegeName,
    } = req.body;
    if (!name) {
        return next({ message: "Name field is missing!" });
    }
    if (!course) {
        return next({ message: "Course name is missing!" });
    }
    if (!coursePercantage) {
        return next({ message: "Course Percentage is missing!" });
    }
    if (!tenthPercentage) {
        return next({ message: "10th percentage is missing" });
    }
    if (!twelvethPercentage) {
        return next({ message: "12th percentage is missing" });
    }
    if (!collegeName) {
        return next({ message: "College Name is missing" });
    }
    try {
        const session = await mongoose.startSession();
        await session.startTransaction();
        const user = await User.findById(req.userId);
        if (user.profileCompleted) {
            return next({ message: "User profile already created!" });
        }
        user.name = name;
        user.course = course;
        user.coursePercentage = coursePercantage;
        user.tenthPercentage = tenthPercentage;
        user.twelvethPercentage = twelvethPercentage;
        user.collegeName = collegeName;
        const downloadURL = await uploadFile("resume", req?.file);
        if (!downloadURL) throw new Error("Error in uploading resume");
        user.resume = downloadURL;
        user.profileCompleted = true;
        let result = await user.save({ session });
        await session.commitTransaction();
        await session.endSession();
        result = result.toObject();
        delete result.password;
        return res.send({ user: result });
    } catch (err) {
        next(err);
    }
};

module.exports.applyForJob = async (req, res, next) => {
    const { jobId } = req.body;
    if (!jobId) {
        return next({ message: "Job Id missing!" });
    }
    try {
        const jobPost = await JobPost.findById(jobId);
        if (!jobPost) {
            return next({ message: "Job Post with this id does not exist!" });
        }
        if (jobPost.jobType === "offcampus") {
            if (jobPost.applied.includes(req.userId)) {
                return next({ message: "User Already applied to this job!" });
            }
            jobPost.applied.push(req.userId);
            await jobPost.save();
            //TODO: what to return in response
            return res.send({ message: "Applied for job successfully!" });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            return next({
                message: "Something went wrong in fetching user details!",
            });
        }
        if (!jobPost?.colleges.includes(user?.collegeName)) {
            return next({
                message:
                    "User's college is not allowed to participate in this job drive!",
            });
        }
        jobPost.applied.push(req.userId);
        await jobPost.save();
        //TODO: what to return in response
        return res.send({ message: "Applied for job successfully!" });
    } catch (error) {
        return next(err);
    }
};

module.exports.offCampusJobs = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return next({
                message: "SOmething went wrong while fetching user details!",
            });
        }
        const jobPost = await JobPost.find({
            // colleges: user?.collegeName,
            jobType: "offcampus",
            applied: { $nin: user._id },
        }).populate("company");
        return res.send({ result: jobPost });
    } catch (err) {
        return next(err);
    }
};

module.exports.onCampusJobs = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return next({
                message: "SOmething went wrong while fetching user details!",
            });
        }
        const jobPost = await JobPost.find({
            colleges: user?.collegeName,
            //jobType: "offcampus",
        }).populate("company");
        return res.send({ result: jobPost });
    } catch (err) {
        return next(err);
    }
};

module.exports.appliedJobs = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return next({
                message: "SOmething went wrong while fetching user details!",
            });
        }
        const jobPost = await JobPost.find({
            applied: { $in: user._id },
        }).populate("company");
        return res.send({ result: jobPost });
    } catch (err) {
        return next(err);
    }
};


module.exports.updateProfile = async(req, res, next) => {
    const userId = req.userId;
    const {
        coursePercantage,
        tenthPercentage,
        twelvethPercentage,
    } = req.body;
    if (!coursePercantage) {
        return next({ message: "Course Percentage is missing!" });
    }
    if (!tenthPercentage) {
        return next({ message: "10th percentage is missing" });
    }
    if (!twelvethPercentage) {
        return next({ message: "12th percentage is missing" });
    }
    try{
        const user = await User.findById(userId);
        user.coursePercentage = coursePercantage;
        user.tenthPercentage = tenthPercentage;
        user.twelvethPercentage = twelvethPercentage;
        if(req?.file){
            const downloadURL = await uploadFile("resume", req?.file);
            if (!downloadURL) throw new Error("Error in uploading resume");
            user.resume = downloadURL;
        }
        let result = await user.save();
        result = result.toObject();
        delete result.password;
        return res.send({ user: result });
    }catch(err){
        return next(err);
    }
}