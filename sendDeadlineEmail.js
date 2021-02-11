const nodemailer = require('nodemailer');

const sendMail = function (tasks) {
    let mailTransporter = nodemailer.createTransport({
        host: process.env.EMAIL_CLIENT_HOST,
        port: process.env.EMAIL_CLIENT_PORT,
        secure: false,
        service: process.env.EMAIL_CLIENT_SERVICE,
        auth: {
            user: process.env.EMAIL_CLIENT_USER,
            pass: process.env.EMAIL_CLIENT_PASS
        }
    });

    tasks.forEach(task => {
        
        let mailDetails = {
            from: process.env.EMAIL_CLIENT_USER,
            to: task.user.email,
            subject: "Task Deadline",
            text: `Your task created on ${task.createdAt} has a set deadline ${task.deadline}.`
        };

        mailTransporter.sendMail(mailDetails, function(err, data) {
            if (err) {
                throw(err)
            } else {
                console.log('Email successfully sent!')
            }
        })
    })
}

module.exports = {sendMail}