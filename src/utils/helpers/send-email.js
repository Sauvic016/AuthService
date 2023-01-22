const sender = require("../../config/emailConfig");
const { EMAIL_ID, BASE_URL } = require("../../config/serverConfig");

const sendVerificationMail = async (userName, email, token) => {
  try {
    const response = await sender.sendMail({
      from: EMAIL_ID,
      to: email,
      subject: "Verify your email address ",
      html: `<p>Hello ${userName}!</p> <br/>
      <p> Thanks for using our services, To verify your email click on the link below  </p>
      <a href="${BASE_URL}api/v1/verify-email?token=${token}"> Verify Email </a>
    `,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = sendVerificationMail;
