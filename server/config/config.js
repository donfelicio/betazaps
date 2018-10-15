var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
	var config = require('./config.json');
	var envConfig = config[env];

	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key]
	});
};

//config.json file in same folder
// {
// 	"test": {
// 		"PORT": 3000,
// 		"MONGODB_URI": "mongodb://localhost:27017/DB_NAME",
// 		"JWT_SECTRET": "SECRET_HERE",
// 		"MAIL_USER": "USER_HERE",
// 		"MAIL_PASS": "PASS_HERE"
// 	}, 
// 	"development": {
// 		"PORT": 3000,
// 		"MONGODB_URI": "mongodb://localhost:27017/DB_NAME",
// 		"JWT_SECTRET": "SECRET_HERE",
// 		"MAIL_USER": "USER_HERE",
// 		"MAIL_PASS": "PASS_HERE"
// 	}
// }