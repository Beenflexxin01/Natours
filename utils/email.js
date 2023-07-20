const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const Transport = require('nodemailer-brevo-transport');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Adenola Omotayo <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //   return nodemailer.createTransport(
      //     new Transport({
      //       apiKey:
      //         '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',
      //     })
      //   );
      return nodemailer.createTransport({
        host: process.env.SENDINBLUE_HOST,
        port: process.env.SENDINBLUE_PORT,

        auth: {
          user: process.env.SENDINBLUE_LOGIN,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
        // secure: false,
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,

      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: false,
    });
  }

  async send(template, subject) {
    // Send the actual email
    // Render HTML based on pug
    const html = pug.renderFile(`${__dirname}/../views/Email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.convert(html),
    };
    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token! (Valid for only 10mins)'
    );
  }
};

// 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
