const nodemailer = required("nodemailer");

exports.sendEmail = async (email, subject, payload) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.abv.bg",
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
        <p> Please, click the link below in next 15 minutes to reset your password.</p>
        <a href="${payload.link}">Reset password</a>,
    </div>`;

    const options = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: subject,
        html: emailHtml

    };

    await transporter.sendMail(options);
}

