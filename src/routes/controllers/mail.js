const Mailgen = require('mailgen')

const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'FlexWork',
        link: 'http://localhost:3000/',
    },
})

module.exports = mailGenerator