const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const EmailVerifyToken = require("../models/EmailVerifyToken");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const InviteToken = require("../models/InviteToken");

module.exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    if (!email) {
        return next({
            code: 400,
            message: "Email cannot be empty!",
        });
    }
    if (!password) {
        return next({
            code: 400,
            message: "Password cannot be empty!",
        });
    }
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return next({
                message: `user with email ${email} already exists`,
                code: 400,
            });
        }
        const secretPass = await bcrypt.hash(password, 12);
        //starts transaction
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            //commit transaction
            let user;
            if (role === "student") {
                user = new User({ email, password: secretPass, role });
            }
            if (role === "pcell") {
                user = new User({ email, password: secretPass, role });
            }
            if (role === "company") {
                user = new User({ email, password: secretPass, role });
            }
            const resUser = await user.save({ session });
            let token = new EmailVerifyToken({
                userId: resUser.id,
                token: crypto.randomBytes(32).toString("hex"),
            });
            token = await token.save({ session });
            await session.commitTransaction();
            const html = `
            <h3>Click <a href="${process.env.BACKEND_URL}/auth/verify/${user.id}/${token.token}">here</a> to verify</h3>
            `;
            await sendMail(resUser.email, "Verification email", { html });
            await session.endSession();
            return res.send({
                message:
                    "User created successfuly! Check your email for verification.",
            });
        } catch (err) {
            console.log("aborting transaction");
            await session.abortTransaction();
            await session.endSession();
            throw err;
        }
    } catch (err) {
        return next(err);
    }
};

module.exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
        return next({
            code: 400,
            message: "Email cannot be empty!",
        });
    }
    if (!password) {
        return next({
            code: 400,
            message: "Password cannot be empty!",
        });
    }
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return next({
                message: "User with this email does not exist",
                code: 404,
            });
        }
        const passCheck = await bcrypt.compare(password, user.password);
        if (!passCheck) {
            return next({
                message: "Incorrect Password",
                code: 400,
            });
        }
        if (!user.emailVerified) {
            let token = await EmailVerifyToken.findOne({ userId: user.id });
            if (!token) {
                token = new EmailVerifyToken({
                    userId: user.id,
                    token: crypto.randomBytes(32).toString("hex"),
                });
                token = await token.save();
            }
            const html = `
            <h3>Click <a href="${process.env.BACKEND_URL}/auth/verify/${user.id}/${token.token}">here</a> to verify</h3>
            `;
            await sendMail(user.email, "Verification email", { html });
            return next({
                message:
                    "User not verified! Check your email for verification.",
            });
        }
        user = user.toObject();
        //console.log(user);
        delete user.password;
        //console.log(user);
        //jwt token creation logic
        const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.secret_key || "1234",
            {
                expiresIn: "1h",
            }
        );
        return res.send({ user, accessToken });
    } catch (err) {
        return next(err);
    }
};

module.exports.verify = async (req, res, next) => {
    const id = req.params.id;
    const token = req.params.token;
    if (!id) {
        return next({ message: "id is required!" });
    }
    if (!token) {
        return next({ message: "Token is required!" });
    }
    let user = await User.findById(id);
    if (!user) {
        console.log("user do not exist");
        return next({ message: "User with this id does not exist!" });
    }
    const tokenCheck = await EmailVerifyToken.findOne({ userId: id, token });
    if (!tokenCheck) {
        console.log("Token either expired or does not exist!");
        return next({ message: "Token either expired or does not exist!" });
    }
    try {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            user.emailVerified = true;
            await user.save({ session });
            await tokenCheck.deleteOne({ session });
            await session.commitTransaction();
            await session.endSession();
            return res.redirect(process.env.FRONTEND_URL + "/login");
        } catch (err) {
            await session.abortTransaction();
            await session.endSession();
            throw err;
        }
    } catch (err) {
        return next({ err });
    }
};

module.exports.createAccount = async (req, res, next) => {
    const { token, password } = req.body;
    if (!token) {
        return next({ message: "Token is required" });
    }
    if (!password) {
        return next({ message: "Password is required" });
    }
    try {
        let inviteToken = await InviteToken.findOne({ token });
        if (!inviteToken) {
            return next({ message: "Invalid invite!" });
        }
        const secretPass = await bcrypt.hash(password, 12);
        //TODO: NEED TO ADD COMPANY REFERENCE TO USER
        const user = new User({
            email: inviteToken.email,
            password: secretPass,
            role: "recruiter",
            emailVerified: true,
        });
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            await user.save({ session });
            await inviteToken.deleteOne({ session });
            await session.commitTransaction();
            await session.endSession();
            return res.send({
                message: "Account created successfully! Login to your account",
            });
        } catch (err) {
            await session.abortTransaction();
            await session.endSession();
            throw err;
        }
    } catch (err) {
        return next(err);
    }
};
