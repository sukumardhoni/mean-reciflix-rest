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
