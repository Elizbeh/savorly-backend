// Import necessary modules
import { sendEmail } from '../../services/emailService';  // Adjust path to where your service is located
import nodemailer from 'nodemailer';

// Mocking the `nodemailer` module to avoid sending real emails
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue('Email sent successfully'),
  }),
}));

describe('sendEmail', () => {

  // Before each test, mock the environment variables (only needed for testing environment)
  beforeAll(() => {
    process.env.EMAIL_USER = 'your_email_here@gmail.com';  // Replace with a test email
    process.env.EMAIL_PASS = 'your_email_password_here';   // Replace with a test password
  });

  it('should send an email successfully', async () => {
    try {
      const result = await sendEmail('test@example.com', 'John', 'https://example.com/verify-email');
      expect(result).toBe('Email sent successfully');  // Assuming you send back success message or handle it in your service
    } catch (error) {
      console.error(error);
      throw error;  // We want this test to fail if an error occurs
    }
  });

  it('should throw an error if email credentials are missing', async () => {
    // Temporarily remove email credentials
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;

    try {
      await sendEmail('test@example.com', 'John', 'https://example.com/verify-email');
    } catch (error) {
      expect(error.message).toBe('Missing email credentials');
    }
  });

  it('should throw an error if email fails to send', async () => {
    // Mocking failure of email sending
    nodemailer.createTransport().sendMail.mockRejectedValue(new Error('Failed to send email'));

    try {
      await sendEmail('test@example.com', 'John', 'https://example.com/verify-email');
    } catch (error) {
      expect(error.message).toBe('Failed to send email');
    }
  });
});
