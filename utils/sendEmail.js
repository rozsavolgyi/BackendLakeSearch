"use strict";
const nodemailer = require("nodemailer");
const ErrorResponse = require("../utils/errorResponse");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Változtasd meg a beállításokat szükség szerint
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD, 
    },
  });

  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Nodemailer hiba:", error);
    throw new ErrorResponse('Email küldési hiba', 500);
  }
}

module.exports = sendEmail;