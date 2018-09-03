const {Zap} = require('./../../db/models/zap');

const zaps = [{
				name: 'first todo',
				description: 'first todo desc'
			},
			{
				name: 'Second todo',
				description: 'second todo desc'
			}];

const populateZaps = (done) => {
	Zap.remove({}).then(() => {
		return Zap.insertMany(zaps);
	}).then(() => {
		done()
	});
};

module.exports = {populateZaps};