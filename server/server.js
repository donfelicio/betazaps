require('./config/config');

const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Zap} = require('./db/models/zap.js')

const publicPath = path.join(__dirname,'../public');
const PORT = process.env.PORT;

const app = new express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

io.on('connect', (socket) => {
	console.log('New socket connected');

	socket.on('search', (params, callback) => {
		console.log(params);
		Zap.find({name: { "$regex": params.query, "$options": "i" }}).then((results) => {
			io.emit('updateSearchResults', {
				results
			});
		});
		callback();
	});

});

app.post('/addZap', (req, res) => {
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
		res.redirect('./')
		//no redirect, but render page with the result (can you do this templated via jQuery?)
	}).catch((e) => {
		return res.status(400).send(e);
	});
});

app.get('/zaps', (req, res) => {
	Zap.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	})
})

server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});

module.exports = {app};