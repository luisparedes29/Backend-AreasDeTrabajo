const nodemailer = require('nodemailer')

let config = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
}

const transporter = nodemailer.createTransport(config)

module.exports = transporter