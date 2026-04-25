const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, name, otp) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 500px; margin: 40px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; color: #0d9488; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { text-align: center; }
        .greeting { color: #333; font-size: 16px; margin-bottom: 20px; }
        .otp-box { 
          background: #f0fdfa; 
          border: 2px solid #0d9488; 
          padding: 20px; 
          border-radius: 6px; 
          margin: 20px 0; 
          font-size: 32px; 
          font-weight: bold; 
          letter-spacing: 4px; 
          color: #0d9488; 
        }
        .expiry { color: #666; font-size: 14px; margin-top: 20px; }
        .footer { color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❤️ HealthGuard AI</h1>
        </div>
        <div class="content">
          <p class="greeting">Hi ${name},</p>
          <p>Please use the following OTP to verify your HealthGuard AI account:</p>
          <div class="otp-box">${otp}</div>
          <p class="expiry">⏱️ This OTP expires in 10 minutes</p>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">If you didn't request this email, please ignore it.</p>
        </div>
        <div class="footer">
          <p>HealthGuard AI - Your Personal Health Assistant</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your HealthGuard AI account',
    html: htmlContent,
  });
};

const sendResetEmail = async (email, name, resetUrl) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 500px; margin: 40px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; color: #0d9488; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { text-align: center; }
        .greeting { color: #333; font-size: 16px; margin-bottom: 20px; }
        .button { 
          display: inline-block; 
          background: #0d9488; 
          color: white; 
          padding: 12px 30px; 
          border-radius: 6px; 
          text-decoration: none; 
          font-weight: bold; 
          margin: 20px 0; 
        }
        .expiry { color: #666; font-size: 14px; margin-top: 20px; }
        .footer { color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❤️ HealthGuard AI</h1>
        </div>
        <div class="content">
          <p class="greeting">Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p class="expiry">⏱️ This link expires in 15 minutes</p>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>HealthGuard AI - Your Personal Health Assistant</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset your HealthGuard AI password',
    html: htmlContent,
  });
};

module.exports = { sendOTPEmail, sendResetEmail };
