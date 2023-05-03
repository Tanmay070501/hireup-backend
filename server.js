require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const checkAuth = require("./middleware/checkAuth");
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
    })
);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
const adminRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");
app.use("/auth", adminRoutes);

app.use("/student", checkAuth, studentRoutes);

app.get("/", (req, res) => {
    return res.send({ message: "Hi from hireup backend" });
});

app.use((err, req, res, next) => {
    if (err) {
        return res.status(err.code || 404).send({
            message: err.message,
        });
    } else {
        return res.status(404).send({ message: "404 Not found" });
    }
});

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI).then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log("Server started at port " + PORT);
    });
});
