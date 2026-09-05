import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

/**
 * Create email transporter
 */
const transporter = nodemailer.createTransport({
  host: config.email.smtpHost,
  port: config.email.smtpPort,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

/**
 * Send verification email
 */
export const sendVerificationEmail = async (email, verificationLink) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                background-color: white;
                padding: 40px;
                border-radius: 0 0 8px 8px;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
                font-weight: 600;
            }
            .button:hover {
                background-color: #5568d3;
            }
            .footer {
                text-align: center;
                color: #999;
                font-size: 12px;
                margin-top: 20px;
                border-top: 1px solid #eee;
                padding-top: 20px;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffc107;
                color: #856404;
                padding: 12px;
                border-radius: 4px;
                margin: 20px 0;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Email Verification</h1>
            </div>
            <div class="content">
                <h2>Welcome to OG REDEGIT!</h2>
                <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
                
                <div style="text-align: center;">
                    <a href="${verificationLink}" class="button">Verify Email</a>
                </div>
                
                <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">
                    ${verificationLink}
                </p>
                
                <div class="warning">
                    ⏰ This link will expire in 24 hours.
                </div>
                
                <p style="color: #999; font-size: 13px;">If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 OG REDEGIT. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: 'Verify Your Email - OG REDEGIT',
      html: htmlTemplate,
    });
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, resetLink) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                background-color: white;
                padding: 40px;
                border-radius: 0 0 8px 8px;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
                font-weight: 600;
            }
            .button:hover {
                background-color: #5568d3;
            }
            .footer {
                text-align: center;
                color: #999;
                font-size: 12px;
                margin-top: 20px;
                border-top: 1px solid #eee;
                padding-top: 20px;
            }
            .warning {
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
                padding: 12px;
                border-radius: 4px;
                margin: 20px 0;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Reset Your Password</h2>
                <p>We received a request to reset your password. Click the button below to create a new password.</p>
                
                <div style="text-align: center;">
                    <a href="${resetLink}" class="button">Reset Password</a>
                </div>
                
                <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">
                    ${resetLink}
                </p>
                
                <div class="warning">
                    ⏰ This link will expire in 1 hour.
                </div>
                
                <p style="color: #999; font-size: 13px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 OG REDEGIT. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: 'Password Reset - OG REDEGIT',
      html: htmlTemplate,
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email, name) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                background-color: white;
                padding: 40px;
                border-radius: 0 0 8px 8px;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
                font-weight: 600;
            }
            .footer {
                text-align: center;
                color: #999;
                font-size: 12px;
                margin-top: 20px;
                border-top: 1px solid #eee;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to OG REDEGIT!</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Your email has been verified and your account is now fully activated.</p>
                <p>You can now log in and start using all features of OG REDEGIT.</p>
                
                <div style="text-align: center;">
                    <a href="${config.server.frontendUrl}/dashboard" class="button">Go to Dashboard</a>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    If you have any questions, feel free to contact our support team.
                </p>
            </div>
            <div class="footer">
                <p>&copy; 2024 OG REDEGIT. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: 'Welcome to OG REDEGIT!',
      html: htmlTemplate,
    });
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};
