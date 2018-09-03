const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {populateZaps} = require('./seed/seed')

beforeEach(populateZaps);

describe('POST /addZap', () => {
	it('Should add a new Zap to DB', (done) => {

		var name = 'Added zap';

		request(app)
		.post('/addZap')
		.send({name})
		.expect(200)
		.end(done);
	});

	it('Should not created Zap without name', (done) => {
		var name = '';

		request(app)
		.post('/addZap')
		.send({name})
		.expect(400)
		.end(done);
	})
});
