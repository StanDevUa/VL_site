import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendNotificationEmail(options: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.MAIL_TO,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
  });
}
