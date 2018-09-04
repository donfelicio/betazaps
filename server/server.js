require('./config/config');

const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Zap} = require('./db/models/zap');
const {emptyRes} = require('./utils/empty-res');
const {sendMail} = require('./utils/mailer');

const publicPath = path.join(__dirname,'../public');
const PORT = process.env.PORT;

const app = new express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(publicPath, {'index':false}));

io.on('connect', (socket) => {
	console.log('New socket connected');

	socket.on('search', (params) => {
		if (params.query) {
			search = {isValid: true, name: { "$regex": params.query.replace( /\+/g, ' ' ), "$options": "i" }};
		} else {
			search = {isValid: true}
		}
		Zap.find(search)
		.then((results) => {

			if(results.length === 0) { results = emptyRes };

			io.emit('updateSearchResults', results);
		}).catch((e) => {
			console.log(e);
		});
	});
});

app.get('/', (req, res) => {
	res.sendFile(publicPath + '/index.html');	
});

app.post('/addzap', (req, res) => {

	const prefix = 'http://';
	const prefixs = 'https://';
	let url = req.body.url;

	if (url.substr(0, prefix.length) !== prefix && url.substr(0, prefixs.length) !== prefixs)
	{
	    url = prefixs + url;
	}

	var zap = new Zap({
		name: req.body.name,
		description: req.body.description,
		developer: req.body.developer,
		url: url,
		//uploadedBy: add userId 
		createdAt: new Date().getTime()
	});
	zap.save().then((doc) => {

		const protocol = 'http://';
		if(req.connection.encrypted) {
			protocol = 'https://';
		}		
		
		sendMail(
			'felix@donfelicio.com', 
			'felix@donfelicio.com', 
			'New BetaZaps add request, please validate', 
			'There was a new addition to betazaps, please verify \n' + 
			`name: ${req.body.name} \n` +
			`description: ${req.body.description} \n` +
			`developer: ${req.body.developer} \n` +
			`url: ${url} \n` +
			`validate now: ${protocol}${req.headers.host}/validate/${doc._id} \n`
			);

		res.redirect(`./`);

	}).catch((e) => {
		return res.status(400).send(e);
	});
});

app.get('/validate/:id', (req, res) => {
	var id  = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(400).send('Not a valid zap');
	}

	Zap.findOneAndUpdate({
		_id: id
	}, {$set: {isValid: true}}, {new: true}).then((zap) => {
		if (!zap) {
			return res.status(400).send('Unable to update zap')
		}
		res.send(zap)
	}).catch((e) => {
		return res.status(400).send();
	});
});

server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});

module.exports = {app};