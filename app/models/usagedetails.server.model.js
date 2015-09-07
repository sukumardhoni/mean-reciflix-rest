'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * UsageDetails Schema
 */

var UsageDetailsSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    default: ''
  },
  device: {
    type: String,
    default: ''
  },
  action: {
    type: String,
    default: ''
  },
  time: {
    date: {
      type: Date,
      default: Date.now
    }
  }
});

mongoose.model('UsageDetails', UsageDetailsSchema);
