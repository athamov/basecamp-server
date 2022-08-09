const nodemailer = require('nodemailer')
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      pool: true,
      host:process.env.SMTP_HOST,
      port:process.env.SMTP_PORT,
      secure:true,
      auth: {
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASSWORD
      }
    })
    }
  async sendAcrivationEmail(to,link) {
    await this.transporter.sendMail({ 
      from:process.env.SMTP_USER,
      to,
      subject:'activation account in ' + process.env.API_URL,
      text:'',
      html:
      `
          <div>
            <h1>Link for activation account</h1>
            <a href=${link}>${link}</a>
          </div>
      `
    }, (err, info) => {
      console.log(err);
      console.log(info);
      console.log("dont work send mailer");
  })
  }
}

module.exports = new MailService();