'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Grocery Schema
 */
var SubCatsSchema = new Schema({
  active: {
    type: Boolean,
    default: false
  },
  catId: {
    type: Schema.ObjectId,
    ref: 'Category'
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
  subCatId: {
    type: String,
    default: ''
  },
  rank: {
    type: Number,
    default: 0
  },
  recipeCount: {
    type: Number,
    default: 0
  },
  submitted: {
    date: {
      type: Date,
      default: Date.now
    }
  }
});

mongoose.model('SubCats', SubCatsSchema);
