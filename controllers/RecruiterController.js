const { default: mongoose } = require("mongoose");
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
    const { title, description, jobLocation, salary, jobType, colleges } =
        req.body;
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
        let extraBody = {};
        if (jobLocation) {
            extraBody["jobLocation"] = jobLocation;
        }
        if (salary) {
            extraBody["salary"] = salary;
        }
        if (jobType === "oncampus" && colleges?.length) {
            extraBody["colleges"] = colleges;
        }
        let jobPost = new JobPost({
            title,
            description,
            createdBy: { name: user.name, user: user._id },
            company: user.company,
            jobType: jobType || "offcampus",
            ...extraBody,
        });
        let session = await mongoose.startSession();
        try {
            session.startTransaction();
            jobPost = await jobPost.save({ session });
            user.jobCount = user.jobCount++;
            await user.save({ session });
            await session.commitTransaction();
            await session.endSession();
            return res.send({
                message: "Job post created successfully!",
                id: jobPost._id,
            });
        } catch (err) {
            await session.abortTransaction();
            await session.endSession();
            throw new Error(err);
        }
    } catch (err) {
        next(err);
    }
};

module.exports.getJobPostList = async (req, res, next) => {
    try {
        let jobList = await JobPost.find({ "createdBy.user": req.userId });
        return res.send({ result: jobList });
    } catch (err) {
        next(err);
    }
};


module.exports.getApplicantsList = async (req, res, next) =>{
    try{
        const {jobId} = req.params;
        const job_post = await JobPost.findById(jobId).populate({path:"applied", select:"-password",});
        const appliedUsers = job_post.applied.filter(el => {
            if(job_post.jobType === "offcampus") return !el.ban
            else return !(el.banByPCell || el.ban)
        });
        return res.send({result: appliedUsers});
    }catch(err){
        next(err);
    }
}

module.exports.jobDelete = async (req, res, next) => {
    try{
        const {jobId} = req?.params;
        const job_post = await JobPost.findById(jobId);
        const user = await User.findById(job_post?.createdBy?.user);
        if(req.userId!== user?.id){
            return next({message:"Unauthorized delete action!!!"});
        }
        user.jobCount = user.jobCount--;
        user.save();
        await JobPost.findByIdAndDelete(job_post._id);
        return res.send({message: "Job Deleted successfully!"})
    }catch(err){
        next(err)
    }
}