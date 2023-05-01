const nodeMailer = require("nodemailer");
const sendMail = async (email, subject, props) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.host,
        service: process.env.service,
        port: Number(process.env.email_port),
        auth:{
            user: process.env.app_email,
            pass: process.env.app_password,
        }
    });
    await transporter.sendMail({
        from: process.env.app_email,
        to: email,
        subject,
        ...props,
    })
}
module.exports = sendMail;