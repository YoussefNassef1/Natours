/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');
const pug = require('pug');
// const sgMail = require('@sendgrid/mail');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name;
    this.url = url;
    this.from = 'xevavi9562@jucatyo.com';
  }

  newTransport() {
    // send grid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    });

    // return nodemailer.createTransport({
    //   host: process.env.Email_HOST,
    //   port: process.env.Email_PORT,
    //   auth: {
    //     user: '3b752f5266146a',
    //     pass: '831b956164a15b'
    //   }
    // });
  }

  async send(template, subject) {
    // 1) render html pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );
    // 2) define email option

    const mailOption = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.compile(html)
    };

    await this.newTransport().sendMail(mailOption);

    // sgMail
    //   .send({
    //     to: this.to,
    //     from: 'ynassef1@gmail.com',
    //     subject,
    //     html: htmlToText.compile(html)
    //   })
    //   .then();

    // return sgMail
    //   .send({
    //     to: this.to,
    //     from: 'ynassef1@gmail.com',
    //     subject,
    //     html: `<h1>hello</h1>`
    //   })
    //   .then(() => {
    //     console.log('Email sent');
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    // 3) create a transporter and send email
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password resetToken (valid for 10 min)'
    );
  }
};
