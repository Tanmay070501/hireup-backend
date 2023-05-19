const JobPost = require("../models/JobPost");
const User = require("../models/User");

module.exports.createProfile = async (req, res, next) => {
    const { name, position } = req.body;
    if (!name) {
        return next({ message: "Name field cannot be empty!" });
    }
    if (!position) {
        return next({ message: "Position field cannot be empty!" });
    }
    try {
        let user = await User.findById(req.userId);
        if (!user) {
            return next({ message: "Invalid Request! User does not exist." });
        }
        if (user.profileCompleted) {
            return next({ message: "User profile already created!" });
        }
        user.name = name;
        user.position = position;
        user.profileCompleted = true;
        user = await user.save();
        user = await user.populate("company");
        user = user.toObject();
        delete user.password;
        return res.send({ result: user });
    } catch (err) {
        return next(err);
    }
};

module.exports.createJobPost = async (req, res, next) => {
    const { title, description } = req.body;
    if (!title) return next({ message: "Job title cannot be empty!" });
    if (!description)
        return next({ message: "Job Description cannot be empty!" });
    try {
        let user = await User.findById(req.userId)
            .select("-password")
            .populate("company");
        if (!user) {
            return next({ message: "Invalid Request! User does not exist." });
        }
        let jobPost = new JobPost({
            title,
            description,
            createdBy: { name: user.name, user: user._id },
            company: user.company,
        });
        jobPost = await jobPost.save();
        return res.send({
            message: "Job post created successfully!",
            id: jobPost._id,
        });
    } catch (err) {
        next(err);
    }
};
