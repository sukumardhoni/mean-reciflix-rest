'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
    catId:{
		type: String,
		default: '',
		trim: true,
		required: 'catId cannot be blank'
	},
	displayName: {
		type: String,
		default: '',
		trim: true,
		required: 'displayName cannot be blank'
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
    imageName: {
		type: String,
		default: ''
	},
    status: {
		type: String,
		default: 'N'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
  	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Category', CategorySchema);
