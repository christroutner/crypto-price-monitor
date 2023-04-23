/*
  This library controls the sending of email alerts.
*/

const nodemailer = require('nodemailer')

class NodeMailer {
  constructor () {
    // Email server info
    this.host = 'box.bchtest.net'
    this.emailUser = 'test@bchtest.net'
    this.emailPassword = 'testtest'
    this.to = 'chris@bchtest.net'

    // Encapsulate dependencies
    this.nodemailer = nodemailer
    this.transporter = this.createTransporter()
  }

  // Define an email server 'transport' for nodemailer
  createTransporter () {
    const transporter = this.nodemailer.createTransport({
      host: this.host,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.emailUser,
        pass: this.emailPassword
      }
    })
    return transporter
  }

  // Handles the sending of data via email.
  async sendEmail (dataIn) {
    try {

      const now = new Date()

      const data = {
        email: this.emailUser,
        to: this.to,
        subject: `Portfolio needs rebalance`
      }

      // Use the provided html or use a default html generated from the input data

      let msg = 'This is a test email'
      if (dataIn.message) msg = dataIn.message

      // const html = data.htmlData || _this.getHtmlFromObject(data)
      const sendObj = {
        // from: `${data.email}`, // sender address
        from: data.email,
        to: data.to, // list of receivers
        // subject: `Pearson ${subject}`, // Subject line
        subject: data.subject,
        html: `<b>Message</b>: ${msg}` // html body
        // html
      }

      // send mail with defined transport object
      const info = await this.transporter.sendMail(sendObj)
      console.log('Message sent: %s', info.messageId)

      return info
    } catch (err) {
      console.error('Error in lib/nodemailer.js/sendEmail()')
      throw err
    }
  }
}

module.exports = NodeMailer
