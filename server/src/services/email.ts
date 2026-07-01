import sgMail from '@sendgrid/mail';

// Only initialize SendGrid if a valid API key is provided
// SendGrid API keys must start with "SG."
const MAIL_API_KEY = process.env.MAIL_API_KEY?.trim();
const isEmailEnabled = MAIL_API_KEY && MAIL_API_KEY.startsWith('SG.');

if (isEmailEnabled) {
  try {
    sgMail.setApiKey(MAIL_API_KEY);
    console.log('✅ Email service enabled (SendGrid)');
  } catch (error) {
    console.warn('⚠️ Failed to initialize SendGrid:', error instanceof Error ? error.message : 'Unknown error');
  }
} else {
  console.log('📧 Email service disabled (no valid SendGrid API key)');
  console.log('   Set MAIL_API_KEY in .env with a key starting with "SG." to enable emails');
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
    subject: 'Reset Your Password - Forge90',
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
              <p>Best regards,<br>The Forge90 Team</p>
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
      The Forge90 Team
    `,
  };

  if (isEmailEnabled && process.env.NODE_ENV === 'production') {
    try {
      await sgMail.send(msg);
      console.log('📧 Password reset email sent to:', email);
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error instanceof Error ? error.message : 'Unknown error');
      // Don't throw - log the URL for manual use
      console.log('📧 Password reset URL (manual):', resetUrl);
    }
  } else {
    console.log('📧 Password reset email (dev/test mode):', resetUrl);
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
    subject: 'Verify Your Email - Forge90',
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

  if (isEmailEnabled && process.env.NODE_ENV === 'production') {
    try {
      await sgMail.send(msg);
      console.log('📧 Verification email sent to:', email);
    } catch (error) {
      console.error('❌ Failed to send verification email:', error instanceof Error ? error.message : 'Unknown error');
      // Don't throw - log the URL for manual use
      console.log('📧 Verification URL (manual):', verifyUrl);
    }
  } else {
    console.log('📧 Verification email (dev/test mode):', verifyUrl);
  }
}

