import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail({ to, subject, html, text }) {
    try {
        const response = await resend.emails.send({
            from: "noreply@resend.dev",
            to,
            subject,
            html,
            text,
        });

        // if (process.env.NODE_ENV == "development") {
        // }
        console.log("Email sent:", response);

        return response;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     connectionTimeout: 20000,
//     greetingTimeout: 20000,
//     socketTimeout: 20000,
//     auth: {
//         type: 'OAuth2',
//         user: process.env.GOOGLE_USER,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//     },
// });


// transporter.verify()
//     .then(() => { console.log("Email transporter is ready to send emails"); })
//     .catch((err) => { console.error("Email transporter verification failed:", err); });

// export async function sendMail({ to, subject, html, text }) {
//     const mailOptions = {
//         from: process.env.GOOGLE_USER,
//         to,
//         subject,
//         html,
//         text
//     };

//     try {
//         const details = await transporter.sendMail(mailOptions);
//         return details;
//     } catch (error) {
//         console.error("Error sending email: ", error);
//         throw error;
//     }
// }
