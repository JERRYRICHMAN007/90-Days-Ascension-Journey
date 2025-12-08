import sgMail from '@sendgrid/mail';

if (process.env.MAIL_API_KEY) {
  sgMail.setApiKey(process.env.MAIL_API_KEY);
}

const FROM_EMAIL = process.env.MAIL_FROM || 'no-reply@ascension-journey.com';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string,
  userId: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}&uid=${userId}`;

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: 'Reset Your Password - Ascension Journey',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #FF6B3D; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Reset Your Password</h1>
            <p>Hi ${name},</p>
            <p>You requested to reset your password. Click the button below to set a new password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <div class="footer">
              <p>Best regards,<br>The Ascension Journey Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Hi ${name},
      
      You requested to reset your password. Visit this link to set a new password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this, please ignore this email.
      
      Best regards,
      The Ascension Journey Team
    `,
  };

  if (process.env.NODE_ENV === 'production' && process.env.MAIL_API_KEY) {
    await sgMail.send(msg);
  } else {
    console.log('📧 Email (dev mode):', resetUrl);
  }
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: 'Verify Your Email - Ascension Journey',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #1E90FF; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verify Your Email</h1>
            <p>Hi ${name},</p>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verifyUrl}" class="button">Verify Email</a>
            <p>Or copy and paste this link: ${verifyUrl}</p>
          </div>
        </body>
      </html>
    `,
  };

  if (process.env.NODE_ENV === 'production' && process.env.MAIL_API_KEY) {
    await sgMail.send(msg);
  } else {
    console.log('📧 Verification email (dev mode):', verifyUrl);
  }
}

