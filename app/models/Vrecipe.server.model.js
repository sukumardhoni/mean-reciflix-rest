'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Vrecipe Schema  (model for Video recipes)
 */
var VrecipeSchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  videoId: {
    type: String,
    default: '',
    trim: true,
    required: 'VideoId cannot be blank'
  },
  author: {
    type: String,
    default: '',
    trim: true,
    required: 'Author cannot be blank'
  },
  published: Date,
  submitted: {
    by: {
      type: String,
      default: '',
      trim: true,
      required: 'Submitted by cannot be blank'
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  duration: Number,
  views: Number,
  likes: Number,
  dislikes: Number,
  description: String,
  notes: String,
  state: Number,
  active: String,
  tags: [],
  subcats: [],
  categories: [],
  images: {
    dft: String,
    mq: String,
    hq: String,
    sd: String
  }

});

mongoose.model('Vrecipe', VrecipeSchema);
