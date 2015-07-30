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
  gListId: {
    type: Schema.ObjectId,
    ref: 'GList'
  },
  submitted: {
    date: {
      type: Date,
      default: Date.now
    }
  }

});

mongoose.model('GListItem', itemSchema);
