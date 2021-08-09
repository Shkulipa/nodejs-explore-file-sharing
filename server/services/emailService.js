const nodeMailer = require("nodemailer");

async function sendMail({ from, to, subject, text, html }) {
    let transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    })

    await transporter.sendMail({
        from: `InShare <${from}>`,
        to,
        subject,
        text,
        html
    })


}

module.exports = sendMail;
