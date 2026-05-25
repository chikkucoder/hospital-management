const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to Bireena Medico Hospital Management System',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #2c3e50;">Welcome to Bireena Medico</h2>
          <p>Dear ${user.name},</p>
          <p>Your account has been successfully created with the following details:</p>
          <ul>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Role:</strong> ${user.role.replace('_', ' ').toUpperCase()}</li>
            <li><strong>Phone:</strong> ${user.phone}</li>
          </ul>
          <p>You can now login to the system using your credentials.</p>
          <p style="color: #7f8c8d; font-size: 14px;">
            If you have any questions, please contact the administrator.
          </p>
          <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
          <p style="color: #95a5a6; font-size: 12px; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to: ${user.email}`);
  } catch (error) {
    logger.error(`Failed to send welcome email to ${user.email}: ${error.message}`);
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request - Bireena Medico',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #e74c3c;">Password Reset Request</h2>
          <p>Dear ${user.name},</p>
          <p>You requested a password reset for your Bireena Medico account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
            Reset Password
          </a>
          <p style="color: #7f8c8d; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
          <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
          <p style="color: #95a5a6; font-size: 12px; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to: ${user.email}`);
  } catch (error) {
    logger.error(`Failed to send password reset email to ${user.email}: ${error.message}`);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail
};