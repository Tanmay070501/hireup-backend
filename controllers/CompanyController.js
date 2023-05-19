const { default: mongoose } = require("mongoose");
const Company = require("../models/Company");
const InviteToken = require("../models/InviteToken");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const { uploadFile } = require("../utils/uploadFile");

module.exports.invite = async (req, res, next) => {
    const { email, userId } = req.body;
    if (!email) {
        return next({
            message: "Email cannot be empty!",
            code: 400,
        });
    }
    try {
        let companyUser = await User.findById(userId);
        if (!companyUser) {
            return next({ message: "Invalid Request! User does not exist!" });
        }
        let user = await User.findOne({ email }).exec();
        if (user) {
            return next({ message: "User with this email id already exists!" });
        }
        //generate token
        let token = await InviteToken.findOne({ email }).exec();
        if (token) {
            const html = `
            <h3>Click <a href="${process.env.FRONTEND_URL}/create/account/${token.token}">here</a> to create an account</h3>
            `;
            await sendMail(token.email, "You are invited to be a Recruiter!", {
                html,
            });
            return res.send({ message: "Invitaion email sent again!" });
        }
        console.log(user);
        token = new InviteToken({
            userId: companyUser?._id,
            token: crypto.randomBytes(32).toString("hex"),
            email,
            company: companyUser?.company,
        });
        token = await token.save();
        //send email with link init
        const html = `
            <h3>Click <a href="${process.env.FRONTEND_URL}/create/account/${token.token}">here</a> to create an account</h3>
            `;
        await sendMail(token.email, "You are invited to be a Recruiter!", {
            html,
        });
        return res.send({ message: "Invitaion email sent" });
    } catch (err) {
        return next(err);
    }
};

module.exports.createProfile = async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.file);
    const { name, logo, description, website } = req.body;
    if (!name) {
        return next({ message: "Company's name cannot be empty!" });
    }
    const data = {};
    data.name = name;
    if (logo != "undefined") {
        data.logo = logo;
    }
    if (description != "undefined") {
        data.description = description;
    }
    if (website != "undefined") {
        data.website = website;
    }
    const session = await mongoose.startSession();
    //console.log("reached");
    //console.log(data);
    try {
        await session.startTransaction();
        let user = await User.findById(req.userId).select("-password");
        if (user.profileCompleted) {
            return next({ message: "Profile already completed." });
        }
        let company = new Company({ userId: req.userId, ...data });
        if (req.file) {
            const downloadUrl = await uploadFile("logo", req.file);
            if (downloadUrl) {
                company.logo = downloadUrl;
            }
        }
        company = await company.save({ session });

        user.company = company._id;
        user.profileCompleted = true;
        user = await user.save({ session });
        user = await user.populate("company");
        //console.log(user);
        await session.commitTransaction();
        await session.endSession();
        return res.send({ result: user.toObject() });
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        await session.endSession();
        return next(error);
    }
};
