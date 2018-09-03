var mongoose = require('mongoose');

var Zap = mongoose.model('Zap', {
	name: {
		type: String, 
		required: true,
		minlength: 1,
		trim: true
	},
	description: {
		type: String, 
		trim: true
	},
	url: {
		type: String, 
		trim: true
	},
	popularity: {
		type: Number
	},
	quality: {
		type: Number
	}, 
	maintenance: {
		type: Number
	},
	developer: {
		type: String,
		trim: true
	},
	uploadedBy: {
		type: mongoose.Schema.Types.ObjectId,
//		required: true
	}, 
	createdAt: {
		type: Number, 
		
	}
});

module.exports = {Zap};