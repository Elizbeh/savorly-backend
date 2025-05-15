const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'elizabeth.behaghel@gmail.com',
    pass: 'vlgjkrgwaqwubkfc'
  },
  tls: {
    rejectUnauthorized: false
  }
});

const mailOptions = {
  from: 'elizabeth.behaghel@gmail.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email.'
};

transporter.sendMail(mailOptions, function (err, info) {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Email sent:', info.response);
  }
});
