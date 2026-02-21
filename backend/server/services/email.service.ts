import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Create transporter based on environment
const createTransporter = (): Transporter | null => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd && process.env.SMTP_HOST) {
    // Production: SendGrid/AWS SES/Custom SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASSWORD!,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    // Development/Production: Gmail (Explicit Configuration via Port 587)
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Must be false for port 587 (STARTTLS)
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // Helps with potential cloud cert issues
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  } else {
    console.warn('⚠️  No email configuration found. Emails will not be sent.');
    return null;
  }
};

let transporter: Transporter | null = null;

try {
  transporter = createTransporter();
  if (transporter) {
    console.log('✅ Email service initialized');
  }
} catch (error) {
  console.error('❌ Failed to initialize email service:', error);
}

// Email templates with branded design
export const emailTemplates = {
  verification: (name: string, verificationUrl: string) => ({
    subject: '🚗 Verify Your gadizone Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to gadizone!</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px; background: #ffffff;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Thank you for signing up! We're excited to have you join our community of car enthusiasts.
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      Please verify your email address to activate your account and start exploring:
                    </p>
                    <!-- Button -->
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 32px 0 0 0;">
                      <strong>Note:</strong> This verification link will expire in 24 hours.
                    </p>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 16px 0 0 0;">
                      If you didn't create an account with gadizone, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      © ${new Date().getFullYear()} gadizone. All rights reserved.<br>
                      Your trusted source for car comparisons and insights.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  welcome: (name: string) => ({
    subject: '🎉 Welcome to gadizone - Your Account is Active!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🎊 Welcome Aboard!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Your account is now verified and ready to use! 🚀
                    </p>
                    <p style="color: #111827; font-size: 18px; font-weight: bold; margin: 0 0 16px 0;">
                      Here's what you can do now:
                    </p>
                    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 32px 0; padding-left: 24px;">
                      <li><strong>Compare Cars:</strong> Side-by-side feature, price, and spec comparisons</li>
                      <li><strong>Calculate EMI:</strong> Get accurate loan estimates and on-road prices</li>
                      <li><strong>Save Favorites:</strong> Keep track of cars you're interested in</li>
                      <li><strong>Latest News:</strong> Stay updated with automotive industry trends</li>
                      <li><strong>Expert Reviews:</strong> Read detailed reviews and ratings</li>
                    </ul>
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Start Exploring Cars
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 32px 0 0 0; text-align: center;">
                      Need help? Reply to this email or visit our help center.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      Happy car hunting!<br>
                      The gadizone Team
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: '🔐 Reset Your gadizone Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Password Reset Request</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      We received a request to reset your password. Click the button below to create a new password:
                    </p>
                    <table role="presentation" style="margin: 0 auto 32px auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 0 0 24px 0;">
                      <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>⚠️ Security Notice:</strong><br>
                        This link will expire in 1 hour for your security.<br>
                        Never share this link with anyone.
                      </p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                      If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      © ${new Date().getFullYear()} gadizone. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  otpLogin: (name: string, otp: string) => ({
    subject: '🔐 Your gadizone Login Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Your Login Code</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi${name ? ` ${name}` : ''},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      Use the following code to log in to your gadizone account:
                    </p>
                    <!-- OTP Code Display -->
                    <div style="background: #f9fafb; border: 2px dashed #dc2626; border-radius: 12px; padding: 24px; margin: 0 auto 32px auto; max-width: 280px;">
                      <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; color: #dc2626; letter-spacing: 8px;">${otp}</span>
                    </div>
                    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; text-align: left; margin: 0 0 24px 0;">
                      <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>⏱️ This code expires in 5 minutes.</strong><br>
                        If you didn't request this code, please ignore this email.
                      </p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                      Never share this code with anyone. gadizone will never ask for your code.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      © ${new Date().getFullYear()} gadizone. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  welcomeLogin: (name: string) => ({
    subject: `👋 Welcome back to gadizone, ${name}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">👋 Welcome Back!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      You've successfully logged in to your gadizone account. 🎉
                    </p>
                    <p style="color: #111827; font-size: 18px; font-weight: bold; margin: 0 0 16px 0;">
                      What would you like to explore today?
                    </p>
                    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 32px 0; padding-left: 24px;">
                      <li><strong>Compare Cars:</strong> Find your perfect match with side-by-side comparisons</li>
                      <li><strong>Latest Launches:</strong> Discover newly launched cars in India</li>
                      <li><strong>Calculate EMI:</strong> Plan your finances with our EMI calculator</li>
                      <li><strong>Expert Reviews:</strong> Read detailed car reviews and ratings</li>
                    </ul>
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Explore Cars Now
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 32px 0 0 0; text-align: center;">
                      If this wasn't you, please secure your account immediately.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      Happy car hunting!<br>
                      The gadizone Team
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  // New Launch Alert Template
  newLaunchAlert: (name: string, carData: { name: string; brand: string; price: string; image?: string; url: string }) => ({
    subject: `New Launch: ${carData.brand} ${carData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f8f9fa;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
                <tr>
                  <td style="padding: 30px 40px; border-bottom: 2px solid #dc2626;">
                    <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">Latest Car Launch</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px;">
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Dear ${name || 'Subscriber'},
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      The all-new <strong>${carData.brand} ${carData.name}</strong> has just been launched in India.
                    </p>
                    <div style="background: #f3f4f6; border-radius: 6px; padding: 20px; margin: 0 0 24px 0; border: 1px solid #e5e7eb;">
                      <h3 style="color: #111827; margin: 0 0 8px 0; font-size: 18px;">${carData.brand} ${carData.name}</h3>
                      <p style="color: #4b5563; font-size: 15px; margin: 0 0 12px 0;">Starting Price</p>
                      <p style="color: #dc2626; font-size: 24px; font-weight: 700; margin: 0;">${carData.price}</p>
                    </div>
                ${carData.image ? `
                    <div style="margin-bottom: 24px;">
                        <img src="${carData.image}" alt="${carData.brand} ${carData.name}" style="width: 100%; height: auto; border-radius: 6px; border: 1px solid #e5e7eb;">
                    </div>`
        : ''}
                    <a href="${carData.url}" style="display: inline-block; background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 15px;">
                      View Specification
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f8f9fa; padding: 20px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      You are receiving this email because you subscribed to new launch alerts.<br>
                      <a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  // Weekly Digest Template
  weeklyDigest: (name: string, data: { recommendations: Array<{ name: string; brand: string; price: string; url: string }> }) => ({
    subject: `Weekly Car Recommendations - ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f8f9fa;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
                <tr>
                  <td style="padding: 30px 40px; border-bottom: 2px solid #dc2626;">
                    <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">Your Weekly Selection</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px;">
                    <p style="color: #4b5563; font-size: 16px; margin: 0 0 20px 0;">
                      Dear ${name || 'Subscriber'},
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Here are the latest cars that match your preferences for this week:
                    </p>
                    ${data.recommendations && data.recommendations.length > 0 ? data.recommendations.map(car => `
                      <div style="padding: 16px; border-bottom: 1px solid #f3f4f6;">
                        <h3 style="color: #111827; margin: 0 0 4px 0; font-size: 16px;">${car.brand} ${car.name}</h3>
                        <p style="color: #dc2626; font-weight: 600; margin: 0 0 8px 0;">${car.price}</p>
                        <a href="${car.url}" style="color: #4b5563; text-decoration: underline; font-size: 14px;">View Details</a>
                      </div>
                    `).join('') : '<p>No new recommendations this week.</p>'}
                    <div style="margin-top: 24px; text-align: center;">
                        <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 15px;">
                        Browse All Cars
                        </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f8f9fa; padding: 20px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} gadizone. All rights reserved.<br>
                      <a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  // Price Drop Alert Template
  priceDropAlert: (name: string, carData: { name: string; brand: string; oldPrice: string; newPrice: string; savings: string; url: string }) => ({
    subject: `Price Drop: ${carData.brand} ${carData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f8f9fa;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
                <tr>
                  <td style="padding: 30px 40px; border-bottom: 2px solid #059669;">
                    <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">Price Drop Alert</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px;">
                    <p style="color: #4b5563; font-size: 16px; margin: 0 0 20px 0;">
                      Dear ${name || 'Subscriber'},
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      A car in your watchlist has just become more affordable:
                    </p>
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 20px; margin: 0 0 24px 0;">
                      <h3 style="color: #059669; margin: 0 0 12px 0; font-size: 18px;">${carData.brand} ${carData.name}</h3>
                      <div style="margin-bottom: 8px;">
                          <span style="color: #9ca3af; text-decoration: line-through; font-size: 14px;">${carData.oldPrice}</span>
                          <span style="color: #059669; font-weight: 700; font-size: 20px; margin-left: 8px;">${carData.newPrice}</span>
                      </div>
                      <p style="color: #047857; margin: 0; font-size: 14px; font-weight: 500;">You save ${carData.savings}</p>
                    </div>
                    <a href="${carData.url}" style="display: inline-block; background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 15px;">
                      View Details
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f8f9fa; padding: 20px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      You are receiving this because you subscribed to price alerts.<br>
                      <a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),
};

// Send email function with robust error handling
export const sendEmail = async (
  to: string,
  template: keyof typeof emailTemplates,
  data: any
): Promise<{ success: boolean; error?: string }> => {
  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    console.error('❌ Invalid email address:', to);
    return { success: false, error: 'Invalid email address' };
  }

  // Handle different template parameter types
  let emailContent;
  try {
    if (['weeklyDigest', 'newLaunchAlert', 'priceDropAlert'].includes(template)) {
      // PRIORITY: data.userName (User) -> data.name (Car/Model - BAD for greeting) -> Default
      // We MUST use userName if available prevents "Dear Creta"
      const name = data.userName || 'Car Enthusiast';
      // Pass the entire data object as the second argument
      emailContent = emailTemplates[template](name, data);
    } else if (template === 'otpLogin') {
      emailContent = emailTemplates[template](data.name, data.otp || '');
    } else if (template === 'welcomeLogin' || template === 'welcome') {
      emailContent = emailTemplates[template](data.name);
    } else {
      emailContent = emailTemplates[template](data.name, data.url || '');
    }
  } catch (err: any) {
    console.error(`Error generating email content for template ${template}:`, err);
    return { success: false, error: 'Template error: ' + err.message };
  }

  // Priority: Try Resend API first (HTTP - works everywhere)
  if (process.env.RESEND_API_KEY) {
    try {
      const { default: axios } = await import('axios');
      const from = process.env.EMAIL_FROM || 'onboarding@resend.dev'; // Default testing domain

      await axios.post(
        'https://api.resend.com/emails',
        {
          from: `gadizone <${from}>`,
          to: [to],
          subject: emailContent.subject,
          html: emailContent.html,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Email sent via Resend API to ${to}`);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Resend API error:', error.response?.data || error.message);
      // Fallback to SMTP if Resend fails? No, usually if API key is set we expect it to work.
      // But we can let it fall through if we want. For now, return error.
      return { success: false, error: 'Resend API failed: ' + (error.response?.data?.message || error.message) };
    }
  }

  try {
    if (!transporter) {
      // ... existing transporter check ...
      console.error('❌ Email service not configured (No Resend Key and No SMTP/Gmail)');
      return { success: false, error: 'Email service not configured' };
    }

    const from = process.env.GMAIL_USER || process.env.SMTP_USER || 'noreply@gadizone.com';

    await transporter.sendMail({
      from: `"gadizone" <${from}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log(`✅ Email sent via SMTP to ${to}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Email send error:', error.message || error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
};

// Test email configuration
export const testEmailService = async (): Promise<boolean> => {
  if (!transporter) {
    console.error('❌ Email transporter not initialized');
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ Email service is ready to send emails');
    return true;
  } catch (error: any) {
    console.error('❌ Email service verification failed:', error.message);
    return false;
  }
};
