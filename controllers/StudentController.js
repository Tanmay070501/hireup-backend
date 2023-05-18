const mongoose = require("mongoose");
const User = require("../models/User");
const firebase = require("../utils/firebase");
const { uploadFile } = require("../utils/uploadFile");

module.exports.createProfile = async (req, res, next) => {
    //console.log(req.body);
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
