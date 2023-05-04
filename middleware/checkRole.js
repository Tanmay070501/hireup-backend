const User = require("../models/User");
const checkRole = function (check_role = false) {
    return async (req, res, next) => {
        const userid = req?.headers?.userid;
        const role = req?.headers?.role;
        if (!userid) {
            return res
                .status(403)
                .send({ message: "User id is missing in request headers" });
        }
        if (!role) {
            return res
                .status(403)
                .send({ message: "Role is missing in request headers" });
        }
        try {
            let user = await User.findById(userid);
            if (!user) {
                return res.status(404).send({ message: "User not found!" });
            }
            if (user.role !== role) {
                return res.status(403).send({ message: "User role mismatch!" });
            }
            if (check_role && checkRole !== user.role) {
                return res
                    .status(403)
                    .send({ message: "You are not authorized!" });
            }
            next();
        } catch (error) {
            return res.status(500).send({ message: "Something went wrong!" });
        }
    };
};

module.exports = checkRole;
