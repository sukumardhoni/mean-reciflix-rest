'use strict';

/**
 * Module dependencies.
 */
var supertest=require('supertest'),
    /*jshint -W079 */
    expect=require('chai').expect,
	mongoose = require('mongoose'),
	Vrecipe = mongoose.model('Vrecipe'),
    api=supertest('http://localhost:3000');

/**
 * Globals
 */
var vrecipe, vrecipeID;

describe('Vrecipe CRUD api tests', function(){

  before(function(done) {
      //define a sample vrecipe object
      vrecipe = {
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
      };
      done();
	});


  it('the api server is live', function(done){
    api.get('/isAlive')
    .set('Accept', 'application/json')
    .expect(200, done);
  });


  it('should bring an empty array', function(done){
    
    api.get('/vrecipes')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err,res){
      expect(res.body).to.be.a('Array');
      expect(res.body.length).to.be.equal(0);
      done();
    });
  });

  it('should be able to add a vrecipe', function(done){
    api.post('/vrecipes')
    .send(vrecipe)
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err,res){
      vrecipeID = res.body._id;
      expect(res.body).to.have.a.property('videoId');
      expect(res.body).to.have.a.property('title');
      expect(res.body).to.have.a.property('views');
      expect(res.body).to.have.a.property('likes');
      expect(res.body).to.have.a.property('dislikes');
      expect(res.body).to.have.a.property('tags');
      expect(res.body.title).to.equal('Test Video receipe 1');
      
      /*jshint -W030 */
      expect(res.body.title).to.be.not.empty;
      done();
    });
    });
  
  it('should fail attempt to retrive a vrecipe by wrong vrecipeid', function(done){
    api.get('/vrecipes/VIDEO1234')
    .expect(400)
    .end(function(err, res){
      expect(err).to.equal(null);
      done();
    });
  });
  
  it('should be able to retrive a saved vrecipe: '+ vrecipeID, function(done){
    api.get('/vrecipes/'+vrecipeID)
    .expect(200)
    .end(function(err, res){
      expect(err).to.equal(null);
      expect(res.body).to.have.a.property('title');
      expect(res.body.title).to.equal('Test Video receipe 1');
      done();
    });
  });
  
  
  it('should be able to change an existing vrecipe');
  it('should be able to increase views of an existing vrecipe');
  it('should be able to increase likes of an existing vrecipe');
  it('should be able to increase displikes of an existing vrecipe');
  it('should be able to append a tags of an existing vrecipe');
  it('should be able to append a category of an existing vrecipe');
  it('should be able to delete a vrecipe by id');

  after(function(done) {
    // console.log('After function is called: cleaning All recipes ');
    api.delete('/cleanAllvrecipes')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err,res){
      expect(err).to.be.a('null');
      console.log(res.body);
      done();
    });
  });
});


describe('Vrecipe bulk api tests', function(){
  before(function(done){
    //load a set of test recipe data  ( 10 vrecipes)
    done();
  });

  it('should get the couont of all videos');
  
  it('should get vrecipes by a tagname and categoryname');
  it('should get all tags');
  it('should get categories by a pagenum');  
  it('should get vrecipes by category by a pagenum');
  it('should get favourite vrecipes by userid');
  it('should be able to add favourite vrecipes for a userid');
  it('should bea able to see newly added vrecipe on the favourite vrecipes by userid');
  it('should be able to remove favourite vrecipes for a userid');
  it('should bea able to not see newly removed vrecipe on the favourite vrecipes by userid');
  it('should get vrecipes of a give maxvies, minviews,maxlikes, minlikes and tags');
  it('should get vrecipes of a given maxviews and minviews');
  after(function(done){
    //clean all loaded recipe data
    done();
  });


});




