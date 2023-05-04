const InviteToken = require("../models/InviteToken");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

module.exports.invite = async (req, res, next) => {
    const { email, userId } = req.body;
    if (!email) {
        return next({
            message: "Email cannot be empty!",
            code: 400,
        });
    }
    try {
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
        token = new InviteToken({
            userId,
            token: crypto.randomBytes(32).toString("hex"),
            email,
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
