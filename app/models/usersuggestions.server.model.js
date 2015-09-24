'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Category Schema
 */
var SuggestionsSchema = new Schema({
  suggestions: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
    match: [/.+\@.+\.+[a-zA-Z]{2,}/, 'Please fill a valid email address']
  },
  time: {
    date: {
      type: Date,
      default: Date.now
    }
  }
});

mongoose.model('Suggestions', SuggestionsSchema);
