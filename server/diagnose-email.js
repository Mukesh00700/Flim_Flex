/**
 * Email Configuration Diagnostic Tool
 * Checks your email setup and identifies issues
 */

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('\n🔍 EMAIL CONFIGURATION DIAGNOSTIC\n');
console.log('='.repeat(50));

// Check 1: Environment variables loaded
console.log('\n1️⃣ Checking Environment Variables...');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || '❌ NOT SET'}`);
console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ SET (' + process.env.EMAIL_PASSWORD.length + ' chars)' : '❌ NOT SET'}`);

if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
  console.log('\n❌ ISSUE FOUND: EMAIL_USER is not configured');
  console.log('\n📝 FIX:');
  console.log('   1. Open: server/.env');
  console.log('   2. Change: EMAIL_USER=your_email@gmail.com');
  console.log('   3. To:     EMAIL_USER=youractualemail@gmail.com');
  console.log('   4. Save the file');
  process.exit(1);
}

if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'your_16_char_app_password') {
  console.log('\n❌ ISSUE FOUND: EMAIL_PASSWORD is not configured');
  console.log('\n📝 FIX - Follow these steps:');
  console.log('   1. Go to: https://myaccount.google.com/');
  console.log('   2. Click: Security (left sidebar)');
  console.log('   3. Find: 2-Step Verification');
  console.log('      → If OFF, turn it ON first');
  console.log('   4. Scroll to: App passwords');
  console.log('   5. Click: App passwords');
  console.log('   6. Select: Mail');
  console.log('   7. Select: Other (Custom name)');
  console.log('   8. Type: FilmFlex');
  console.log('   9. Click: Generate');
  console.log('   10. Copy the 16-character password (remove spaces)');
  console.log('   11. Open: server/.env');
  console.log('   12. Change: EMAIL_PASSWORD=your_16_char_app_password');
  console.log('   13. To:     EMAIL_PASSWORD=abcdefghijklmnop (your generated password)');
  console.log('   14. Save the file');
  process.exit(1);
}

console.log('   ✅ Both credentials are set!');

// Check 2: Test transporter connection
console.log('\n2️⃣ Testing Email Server Connection...');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('   ❌ Connection FAILED');
    console.log('\n🔍 Error Details:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 This usually means:');
      console.log('   1. Wrong email or password');
      console.log('   2. Not using App Password (using regular Gmail password)');
      console.log('   3. 2-Step Verification not enabled');
      console.log('\n📝 SOLUTION:');
      console.log('   - Make sure you generated App Password (not regular password)');
      console.log('   - Enable 2-Step Verification first');
      console.log('   - Visit: https://myaccount.google.com/apppasswords');
    }
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication Failed:');
      console.log('   - Double-check your EMAIL_PASSWORD in .env');
      console.log('   - It should be 16 characters (no spaces)');
      console.log('   - Must be App Password, not regular password');
    }
    
    process.exit(1);
  } else {
    console.log('   ✅ Connection successful!');
    console.log('\n3️⃣ Sending Test Email...');
    
    const testOTP = '123456';
    const mailOptions = {
      from: `"FilmFlex Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '🧪 Test Email - FilmFlex Email System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3b82f6;">✅ Email System Working!</h1>
            <p>If you're reading this, your FilmFlex email configuration is correct!</p>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h2 style="margin: 0; letter-spacing: 8px;">${testOTP}</h2>
            </div>
            <p>Your email system is ready to send OTP verification emails.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">This is a test email from FilmFlex diagnostic tool.</p>
          </div>
        </div>
      `,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('   ❌ Failed to send test email');
        console.log(`   Error: ${error.message}`);
        process.exit(1);
      } else {
        console.log('   ✅ Test email sent successfully!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log('\n='.repeat(50));
        console.log('\n🎉 SUCCESS! Your email configuration is working!');
        console.log(`\n📬 Check your inbox: ${process.env.EMAIL_USER}`);
        console.log('📧 Subject: "🧪 Test Email - FilmFlex Email System"');
        console.log('🔢 Test OTP in email: 123456');
        console.log('\n✨ You can now use email verification in your app!');
        console.log('\n💡 Next steps:');
        console.log('   1. Check your email inbox');
        console.log('   2. If you see the test email, everything is working');
        console.log('   3. Try registering a user in your app');
        console.log('   4. You should receive OTP emails now\n');
        process.exit(0);
      }
    });
  }
});
