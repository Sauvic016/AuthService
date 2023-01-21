const sender = require("../../config/emailConfig");
const { EMAIL_ID } = require("../../config/serverConfig");
const AppError = require("../errorHandling/error-handler");

const sendVerificationMail = async (userName, email, token) => {
  try {
    const response = await sender.sendMail({
      from: EMAIL_ID,
      to: email,
      subject: "Email Verification",
      html: `<h2>HELLO ${userName}<h2/>
      <h3> Thanks for using our services, Please verify your email </h3>
      <a href="http:localhost:3001/api/v1/verify-email?token=${token}"> Verify You </a>
    `,
    });
  } catch (error) {
    console.log(error);
    throw new AppError();
  }
};
module.exports = sendVerificationMail;
