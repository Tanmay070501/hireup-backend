const jwt = require("jsonwebtoken");
const checkAuth = (req, res, next) => {
    try {
        const token =
            req.headers.authorization &&
            req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).send({ message: "Authorization failed" });
        }
        const payload = jwt.verify(token, process.env.secret_key);
        req.userId = payload.id;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res
                .status(440)
                .send({ message: "Token Expired! Login again." });
        }
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({ message: "Invalid Token!" });
        }
        return res.status(400).send({ message: err.message });
    }
};

module.exports = checkAuth;
