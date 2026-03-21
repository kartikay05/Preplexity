import SibApiV3Sdk from "sib-api-v3-sdk";
const client = SibApiV3Sdk.ApiClient.instance;

// Auth
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.Brevo_SMTP_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendMail({ to, subject, html, text }) {
  try {
    const response = await emailApi.sendTransacEmail({
      sender: {
        email: "kartikaynbb@gmail.com",
        name: "KRT AI",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error("Brevo Error:", error);
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
