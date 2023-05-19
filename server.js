require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const upload = require("multer")();
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
    })
);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//middlewares
const checkAuth = require("./middleware/checkAuth");
const checkRole = require("./middleware/checkRole");
//Routes
const adminRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");
const companyRoutes = require("./routes/company");
const recruiterRoutes = require("./routes/recruiter");
const JobController = require("./controllers/JobController");
app.get("/", (req, res) => {
    return res.send({ message: "Hi from hireup backend" });
});

app.use("/auth", adminRoutes);
app.use("/job/:jobId", checkAuth, JobController.getJobDetails);
app.use("/student", checkAuth, checkRole("student"), studentRoutes);
app.use("/company", checkAuth, checkRole("company"), companyRoutes);
app.use("/recruiter", checkAuth, checkRole("recruiter"), recruiterRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    if (err) {
        if (err?.code) {
            if (typeof err.code == "string") {
                err.code = 500;
            }
            if (err.code > 599 || err.code < 400) {
                err.code = 500;
            }
        }
        console.log(err.code);
        return res.status(err?.code || 404).send({
            message: err?.message,
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
