import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, html: string) {
  // Use this to generate an account
  // const testAccount = await nodemailer.createTestAccount();
  // console.log("TestACC: ", testAccount);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "o5dt7acymwzfi5gc@ethereal.email", // generated ethereal user
      pass: "Zer33XgdB2RP8Fu3uu", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to,
    subject: "Change password", // Subject line
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
