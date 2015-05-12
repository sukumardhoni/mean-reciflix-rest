'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    /*jshint -W079 */
    expect=require('chai').expect,
    supertest=require('supertest'),
	mongoose = require('mongoose'),
	Vrecipe = mongoose.model('Vrecipe'),
    api=supertest('http://localhost:3000');





/**
 * Globals
 */
var vrecipe;


/**
 * Unit tests
 */
describe('Vrecipe Model Unit Tests:', function() {


    beforeEach(function(done) {
      //define a sample vrecipe object
      vrecipe = new Vrecipe({
        title: 'Test Video receipe 1',
        videoId: 'VIDEOID1',
        author: 'ytauthor',
        published: '2012-11-01',
        submitted: {
            by: 'testuser',
            date: new Date()
        },
        duration: 10000,
        views: 1000,
        likes: 100,
        dislikes: 10,
        description: 'test description 1',
        notes: 'test notes 1',
        state: 0,
        active: 'N',
        tags: ['nonveg', 'chicken'],
        categories: ['nonveg'],
        images: {
            dft: 'test1.png',
            mq: 'test2.png',
            hq: 'test3.png',
            sd: 'test4.png',
        }
      });
      done();
	});

	describe('Method Save', function() {

        it('should begin with no vrecipes', function(done) {
			Vrecipe.find({}, function(err, vrecipes) {
				vrecipes.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			return vrecipe.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

        it('should be able to show as exists after save', function(done) {
			Vrecipe.find({videoId: vrecipe.videoId}, function(err, vrecipes) {
				vrecipes.should.have.length(0);
				done();
			});
		});


		it('should be able to show an error when try to save without title', function(done) {
			vrecipe.title = '';

			return vrecipe.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should be able to save without number of views', function(done) {
			vrecipe.views = '';

			return vrecipe.save(function(err) {
				should.not.exist(err);
				done();
			});
		});


       it('should be able to save without number of likes', function(done) {
			vrecipe.likes = '';

			return vrecipe.save(function(err) {
				should.not.exist(err);
				done();
			});
		});


	});

	afterEach(function(done) {
		Vrecipe.remove().exec(function() {
			Vrecipe.remove().exec(done);
		});
	});



});
