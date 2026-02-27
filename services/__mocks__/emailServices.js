// services/__mocks__/emailService.js
module.exports = {
  sendEmail: async (to, first_name, verificationUrl) => {
    console.log(`Mock sendEmail called for ${to}, URL: ${verificationUrl}`);
    return true; // simulate successful email sending
  },
};