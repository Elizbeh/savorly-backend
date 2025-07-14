// tests/unit/email.test.js
import nodemailer from 'nodemailer';
import { sendEmail } from '../../services/emailService.js';
import logger from '../../config/logger.js';

jest.mock('../../config/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock nodemailer
jest.mock('nodemailer');

describe('sendEmail', () => {
  let sendMailMock;

  beforeAll(() => {
    sendMailMock = jest.fn();
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'testpass';
  });

  afterAll(() => {
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
  });

  it('should reject if EMAIL_USER or EMAIL_PASS are missing', async () => {
    delete process.env.EMAIL_USER;
    await expect(sendEmail('to@test.com', 'User', 'http://verify.url')).rejects.toThrow('Missing email credentials');
  });

  it('should send email successfully', async () => {
    sendMailMock.mockImplementation((mailOptions, callback) => {
      callback(null, { response: '250 Message accepted' });
    });

    await expect(sendEmail('to@test.com', 'User', 'http://verify.url')).resolves.toEqual({ response: '250 Message accepted' });

    expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({
      auth: {
        user: 'test@example.com',
        pass: 'testpass'
      }
    }));

    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      to: 'to@test.com',
      subject: 'Verify Your Email Address',
    }), expect.any(Function));
  });

  it('should reject if sendMail returns error', async () => {
    sendMailMock.mockImplementation((mailOptions, callback) => {
      callback(new Error('Failed to send'), null);
    });

    await expect(sendEmail('to@test.com', 'User', 'http://verify.url')).rejects.toThrow('Failed to send email');

    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Email send failed'));
  });

  
});
