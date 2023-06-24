const JobPost = require("../models/JobPost");
const User = require("../models/User");

module.exports.createProfile = async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return next({ message: "College Name field is missing" });
    }
    try {
        let user = await User.findById(req.userId);
        if (!user) {
            return next({
                message:
                    "Something went wrong in fethcing user details! Check user id again.",
            });
        }
        if (user.profileCompleted) {
            return next({ message: "User profile already created!" });
        }
        user.profileCompleted = true;
        user.name = name;
        user = await user.save();
        user = user.toObject();
        delete user.password;
        return res.send({ user: user });
    } catch (err) {
        return next(err);
    }
};

module.exports.getStudents = async (req, res, next) => {
    try {
        let user = await User.findById(req.userId);
        if (!user) {
            return next({
                message:
                    "Something went wrong in fethcing user details! Check user id again.",
            });
        }
        let students = await User.find({
            collegeName: user.name,
        }).select("-password");
        return res.send({ result: students });
    } catch (err) {
        return next(err);
    }
};

module.exports.getJobPosts = async (req, res, next) => {
    try {
        let user = await User.findById(req.userId);
        if (!user) {
            return next({
                message:
                    "Something went wrong in fethcing user details! Check user id again.",
            });
        }
        let jobPosts = await JobPost.find({
            colleges: { $in: user.name },
            jobType: "offcampus",
        });
        return res.send({ result: jobPosts });
    } catch (err) {
        return next(err);
    }
};

module.exports.toggleBan = async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id) {
            return next({ message: "User id is required to ban a user" });
        }
        const userToBan = await User.findById(id).select("-password");
        if (!userToBan) {
            return next({ message: "User with provided id does not exist" });
        }
        const userBanning = await User.findById(req.userId).select("-password");
        if (userToBan?.collegeName !== userBanning?.name) {
            return next({ message: "You cannot ban this student!" });
        }
        const ban = userToBan.banByPCell;
        userToBan.banByPCell = !ban;
        await userToBan.save();
        return res.send({
            message: `Student ${ban ? "unbanned" : "banned"} successfully!`,
        });
    } catch (err) {
        next(err);
    }
};
