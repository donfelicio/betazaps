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
			search = {name: { "$regex": params.query, "$options": "i" }};
		} else {
			search = {}
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
	var zap = new Zap({
		name: req.body.name,
		description: req.body.description,
		popularity: req.body.popularity,
		quality: req.body.quality,
		maintenance: req.body.maintenance,
		developer: req.body.developer,
		//uploadedBy: add userId 
		createdAt: new Date().getTime()
	});
	zap.save().then((doc) => {
		res.redirect(`./?query=${req.body.name}`);
	}).catch((e) => {
		return res.status(400).send(e);
	});
});

// app.get('/zaps', (req, res) => {
// 	Zap.find().then((zaps) => {
// 		res.send({zaps});
// 	}, (e) => {
// 		res.status(400).send(e);
// 	});
// });

server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});

module.exports = {app};