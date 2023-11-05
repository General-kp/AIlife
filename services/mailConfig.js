const nodemailer = require("nodemailer")

//Creating the trasporter configuration, with the email and
//  password(app password generated in google account after turning on the 2step-verification)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.PASSWORD
  }
})

module.exports = {
  transporter
}