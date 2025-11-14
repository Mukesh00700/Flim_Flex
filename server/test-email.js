/**
 * Email Configuration Test Script
 * Run this to test if your email setup is working
 * 
 * Usage: node test-email.js
 */

import { sendVerificationEmail } from './config/nodemailer.js';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  console.log('\n🧪 Testing Email Configuration...\n');
  
  // Check if email credentials are set
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.error('❌ EMAIL_USER is not configured!');
    console.error('📝 Please update EMAIL_USER in .env file\n');
    process.exit(1);
  }
  
  if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'your_16_char_app_password') {
    console.error('❌ EMAIL_PASSWORD is not configured!');
    console.error('📝 Please update EMAIL_PASSWORD in .env file');
    console.error('📖 See EMAIL_SETUP_QUICK.md for instructions\n');
    process.exit(1);
  }
  
  console.log(`✅ EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`✅ EMAIL_PASSWORD: ${'*'.repeat(16)} (hidden)\n`);
  
  // Test sending email
  const testOTP = '123456';
  const testRecipient = process.env.EMAIL_USER; // Send to yourself for testing
  const testName = 'Test User';
  
  console.log(`📧 Sending test OTP email to: ${testRecipient}`);
  console.log(`🔢 Test OTP: ${testOTP}\n`);
  
  try {
    await sendVerificationEmail(testRecipient, testName, testOTP);
    console.log('\n✅ SUCCESS! Test email sent successfully!');
    console.log(`📬 Check your inbox: ${testRecipient}`);
    console.log('📧 Subject: "Verify Your Email - FilmFlex"');
    console.log('🔢 Look for OTP: 123456\n');
    console.log('✨ Email configuration is working correctly!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ FAILED! Could not send test email');
    console.error('\n🔍 Error Details:');
    console.error(`   Message: ${error.message}`);
    if (error.code) console.error(`   Code: ${error.code}`);
    if (error.command) console.error(`   Command: ${error.command}`);
    
    console.error('\n💡 Common Solutions:');
    console.error('   1. Make sure you\'re using App Password, not regular Gmail password');
    console.error('   2. Enable 2-Step Verification in Google Account');
    console.error('   3. Generate App Password at: https://myaccount.google.com/apppasswords');
    console.error('   4. Update EMAIL_PASSWORD in .env file');
    console.error('   5. Restart the server after changing .env');
    console.error('\n📖 See EMAIL_SETUP_QUICK.md for detailed instructions\n');
    process.exit(1);
  }
};

testEmail();
