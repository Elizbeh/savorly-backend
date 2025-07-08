import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

export const sendEmail = (to, first_name, verificationUrl) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const errorMsg = 'Missing email credentials';
    logger.error(errorMsg);
    return Promise.reject(new Error(errorMsg));
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Verify Your Email Address',
    html: `
      <!-- Your full HTML email remains unchanged -->
      <html>
        <head>
          <style>/* styles */</style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h2>Welcome to Savorly</h2>
            </div>
            <div class="email-body">
              <p>Hi ${first_name},</p>
              <p>Thank you for signing up on Savorly! To complete your registration, please verify your email address by clicking the button below:</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" target="_blank" class="btn">Verify My Email</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="text-align: center;"><a href="${verificationUrl}" target="_blank">${verificationUrl}</a></p>
              <p>If you did not sign up for this account, please ignore this email.</p>
            </div>
            <div class="email-footer">
              <p>Thanks,<br>Savorly Team</p>
              <p>If you have any questions, feel free to contact us at support@savorly.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`Email send failed to ${to}: ${error.message}`);
        return reject(new Error('Failed to send email'));
      }

      logger.info(`Verification email sent to ${to}`);
      resolve(info);
    });
  });
};
