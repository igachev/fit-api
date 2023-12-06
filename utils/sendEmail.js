const nodemailer = require("nodemailer");

exports.sendEmail = (email, subject, payload) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASS,
        },
        tls:{
            rejectUnauthorized:false
          }
    });


    const emailHtml = `
    <div>
        <p>Hi, ${payload.name}.</p>
        <p>You requested to reset your password.</p>
        <p>Please, click the link below in the next 15 minutes to reset it.</p>
        <a href="${payload.link}">Reset password</a>
    </div>`;

    const options = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: subject,
        html: emailHtml

    };

    return transporter.sendMail(options);
}

