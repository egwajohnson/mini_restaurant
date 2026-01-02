import nodemailer from "nodemailer";
let configOptions = {
  host: "1.2.3.4",
  port: 465,
  secure: true,
  tls: {
    // must provide server name, otherwise TLS certificate check will fail
    servername: "example.com",
  },
};

export const mailAdmin = async (
  data: { email: string; subject: string; emailInfo: any },
  cb: Function
) => {
  try {
    const sender = "thetechbrocode@gmail.com";
    const transporter = nodemailer.createTransport({
      host: sender,
      //   port: 587,
      service: "gmail",
      secure: true,
      auth: {
        user: sender,
        pass: "mkqe gpgq zlcy wbkt",
      },
    });

    const message = {
      from: `Aboo Tech ${sender}`,
      to: data.email,
      subject: data.subject,
      html: cb(data.emailInfo),
    };

    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};
