const User = require("../models/User");

module.exports.users = async (req, res, next) => {
    try {
        let users = await User.find({}).select("-password");
        return res.send({ result: users });
    } catch (err) {
        next(err);
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
        if (userToBan.role === "admin") {
            return next({ message: "Admin can't ban admin dummy!" });
        }
        const ban = userToBan.ban;
        userToBan.ban = !ban;
        await userToBan.save();
        return res.send({
            message: `User ${ban ? "unbanned" : "banned"} successfully!`,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.CompanyApprovalList = async (req, res, next) => {
    try {
        let users = await User.find({
            role: "company",
            approvedByAdmin: false,
        }).select("-password");
        return res.send({ result: users });
    } catch (err) {
        next(err);
    }
};

module.exports.PcellApprovalList = async (req, res, next) => {
    try {
        let users = await User.find({
            role: "pcell",
            approvedByAdmin: false,
        }).select("-password");
        return res.send({ result: users });
    } catch (err) {
        next(err);
    }
};

module.exports.Approve = async (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        return next({ message: "ID is missing!" });
    }
    try {
        let user = await User.findById(id).select("-password");
        if (!user) {
            return next({ message: "User with provided id not found!" });
        }
        user.approvedByAdmin = true;
        await user.save();
        return res.send({ message: "User approved successfully!" });
    } catch (error) {
        next(error);
    }
};
