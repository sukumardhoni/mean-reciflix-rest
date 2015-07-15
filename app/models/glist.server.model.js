'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Grocery Schema
 */
var GlistSchema = new Schema({
  name: {
    type: String
  },
  state:{
    type: Boolean
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  submitted: {
    date: {
      type: Date,
      default: Date.now
    }
  }
});

mongoose.model('Glist', GlistSchema);
