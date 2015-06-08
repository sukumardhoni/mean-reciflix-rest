'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

var ProspectiveEmailSchema = new Schema({
   platform: {
    type: String
      },

  email: {
    type: String,
    trim: true,
    default: '',
    unique: 'Email already exist',
    validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  }
   });

mongoose.model('ProspectiveEmail', ProspectiveEmailSchema);
