const User = require("../models/User");

module.exports.invite = async (req, res, next) => {
    const { email } = req.body;
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
        //save token
        //send email with link init
    } catch (err) {
        return next(err);
    }
};
