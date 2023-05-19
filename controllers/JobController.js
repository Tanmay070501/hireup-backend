const JobPost = require("../models/JobPost");

module.exports.getJobDetails = async (req, res, next) => {
    const { jobId } = req.params;
    if (!jobId) return next({ message: "Job id missing!" });
    try {
        const jobPost = await JobPost.findById(jobId)
            .populate({ path: "createdBy.user", select: "-password" })
            .populate("company");
        if (!jobPost)
            return next({ message: "Job post with this id does not exist!" });
        return res.send({ result: jobPost });
    } catch (err) {
        return next(err);
    }
};
