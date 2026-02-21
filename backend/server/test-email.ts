import { sendEmail, testEmailService } from './services/email.service';

// Test email configuration
console.log('\n📧 Testing email service...\n');

testEmailService().then(async (isReady) => {
    if (isReady) {
        console.log('\n✅ Email service verified successfully!\n');

        // Send a test email
        console.log('📤 Sending test email...\n');

        const testEmail = process.env.TEST_EMAIL || process.env.GMAIL_USER;

        if (testEmail) {
            const result = await sendEmail(
                testEmail,
                'passwordReset',
                {
                    name: 'Test User',
                    url: 'http://localhost:3000/reset-password?token=test123'
                }
            );

            if (result.success) {
                console.log('✅ Test email sent successfully to:', testEmail);
                console.log('📬 Please check your inbox (and spam folder)\n');
            } else {
                console.log('❌ Failed to send test email:', result.error);
            }
        } else {
            console.log('⚠️  No TEST_EMAIL or GMAIL_USER found in .env');
        }
    } else {
        console.log('❌ Email service not ready');
    }

    process.exit(0);
});
