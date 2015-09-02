'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Category Schema
 */
var NewCategorySchema = new Schema({
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
  subCatsExist: {
    type: Boolean,
    default: false
  },
  rank: {
    type: Number,
    default: 0
  },
  recipeCount: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: false
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

mongoose.model('NewCategory', NewCategorySchema);
