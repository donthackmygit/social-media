import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.mailersend.net',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.MAILERSEND_USERNAME, 
        pass: process.env.MAILERSEND_PASSWORD 
    }
});

const sendEmail = async ({to, subject, body}) => {
    const response = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to, 
        subject,
        html: body
    })
    return response
}

export default sendEmail