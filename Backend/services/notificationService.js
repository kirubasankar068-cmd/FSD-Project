const nodemailer = require('nodemailer');
let io;

const setIo = (socketIoInstance) => {
  io = socketIoInstance;
};

const sendNotification = async (recipientId, message, type, data = {}) => {
  try {
    // 1. Real-time notification via Socket.io
    if (io) {
      io.to(recipientId.toString()).emit('notification', {
        message,
        type,
        data,
        createdAt: new Date()
      });
      console.log(`[Notification] Socket sent to ${recipientId}`);
    }

    // 2. Persist in DB (Optional but recommended)
    const Notification = require('../models/Notification');
    if (Notification) {
      await Notification.create({
        recipient: recipientId,
        message,
        type,
        ...data
      });
    }
  } catch (error) {
    console.error('[Notification Error] Real-time fail:', error.message);
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || process.env.COMPANY_EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.COMPANY_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"JobGrox" <${process.env.COMPANY_EMAIL || 'no-reply@jobgrox.ai'}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Sent to ${to}`);
  } catch (error) {
    console.error('[Email Error] Dispatch fail:', error.message);
  }
};

module.exports = {
  setIo,
  sendNotification,
  sendEmail
};
