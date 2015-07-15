'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Grocery Schema
 */
var itemSchema = new Schema({
  name: {
    type: String
  },
  state:{
    type: Boolean
  },
  glistid: {
    type: Schema.ObjectId,
    ref: 'Glist'
  },
  submitted: {
    date: {
      type: Date,
      default: Date.now
    }
  }

});

mongoose.model('Glistitem', itemSchema);
