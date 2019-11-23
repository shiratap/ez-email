'use strict';

require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = (recipients, message, emailCredentials) => {
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      service: process.env.SERVICE
        ? process.env.SERVICE
        : emailCredentials
        ? emailCredentials.service
        : 'gmail',
      auth: {
        user: process.env.EMAIL || emailCredentials.email,
        pass: process.env.PASSWORD || emailCredentials.password
      },
      pool: true
    });
  } catch (e) {
    console.log(
      `ez-email Error: Make sure that your email credentials live in the .env file or pass in your email credentials as the third argument\n`,
      e
    );
  }
  try {
    recipients.forEach(recipient => {
      const mailOptions = {
        from: process.env.EMAIL || emailCredentials.email,
        to: recipient.email || recipient,
        subject: message ? message.subject : ''
      };
      if (message && message.messageType === 'html') {
        if (message && message.greeting && recipient.name) {
          message.message = `${message.greeting} ${recipient.name},<br><br>${message.message}`;
        } else if (message && message.greeting) {
          message.message = `${message.greeting} ${recipient},<br><br>${message.message}`;
        }
        mailOptions.html = message.message;
      } else {
        if (message && message.greeting && recipient.name) {
          message.message = `${message.greeting} ${recipient.name},\n\n${message.message}`;
        } else if (message && message.greeting) {
          message.message = `${message.greeting} ${recipient},\n\n${message.message}`;
        }
        if (message && message.text && message.message) {
          mailOptions.text = message.message;
        }
      }

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.error(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    });
  } catch (e) {
    console.log(
      '\nez-email Error: No list of recipients to iterate. Make sure your recipient list is in an array formatted as such: \n\n["email@email.com"] or [{email:"email@email.com", name:"someGuy"}]\n\nReference documentation for function parameters\n',
      e
    );
  }
};
