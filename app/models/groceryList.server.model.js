'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Grocery Schema
 */
var GrocerySchema = new Schema({
  name: {
    type: String
  },
  active:{
    type: Boolean
  },
  completed:{
    type: Boolean
  },
  items: [],
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

mongoose.model('Grocery', GrocerySchema);
