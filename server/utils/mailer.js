const nodemailer = require('nodemailer');
require('./../config/config');

var sendMail = ((from, to, subject, text) => {

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS
		}
	});

	var mailOptions = {from, to, subject, text};

	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response)
		}
	});
});

module.exports = {sendMail};