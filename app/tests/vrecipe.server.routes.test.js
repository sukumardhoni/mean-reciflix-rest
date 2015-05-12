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
        dislikes: 13,
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



	 it('should bring an single recipee array', function(done){
    api.get('/vrecipes')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err,res){
      expect(res.body).to.be.a('Array');
      expect(res.body.length).to.be.equal(1);
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
  
  it('should be able to retrive a saved vrecipe by id: '+ vrecipeID, function(done){
    api.get('/vrecipes/'+vrecipeID)
    .expect(200)
    .end(function(err, res){
      expect(err).to.equal(null);
      expect(res.body).to.have.a.property('title');
      expect(res.body.title).to.equal('Test Video receipe 1');
			expect(res.body).to.have.a.property('videoId');
			expect(res.body.videoId).to.equal('VIDEOID1');
		var tags = expect(res.body.tags).to.include('chicken','nonveg');
			 console.log('Updated Tags' + JSON.stringify(tags));
      done();
    });
  });
  
    it('should be able to Update an existing vrecipe' + vrecipeID,function(done){
			api.put('/vrecipes/'+vrecipeID)
			.set('Accept', 'application/json')
			.send({
			  title: 'Global Tech Minds',
				videoId: 'GTMVIDEOID1',
        author: 'ytauthor',
        published: '2012-11-01',
				views:'10000',
				likes:'1000',
				tags:['Curry','Gravy','chicken','nonveg']
			})
			.expect(200)
			.end(function (err, res) {
	      res.body.should.have.property('title');
	      var title = res.body.title.should.equal('Global Tech Minds');
	      console.log('Updated Title' + JSON.stringify(title));
	      res.body.videoId.should.equal('GTMVIDEOID1');
	      var date = res.body.submitted.date.should.not.equal(null);
	      console.log('Updated Recipe date' + JSON.stringify(date));
				res.body.should.have.property('views');
				var views = res.body.views.should.equal(10000);
				console.log('Updated Recipe views' + JSON.stringify(views));
				var likes = res.body.likes.should.equal(1000);
				console.log('Updated Recipe likes' + JSON.stringify(likes));
				var dislikes = res.body.dislikes.should.equal(13);
				console.log('Updated Recipe dislikes' + JSON.stringify(dislikes));
				var tags = expect(res.body.tags).to.include('Curry','Gravy','chicken','nonveg');
			  console.log('Updated Tags' + JSON.stringify(tags));
				 expect(res.body.tags.length).to.be.equal(4);
	      done();
       });
		});




	it('should be able to Delete a vrecipe by id' + vrecipeID,function(done){
		  api.delete('/vrecipes/'+vrecipeID)
    .expect(200)
    .end(function(err, res){
      expect(err).to.equal(null);

      done();
    });
	});

	  it('should bring an empty array after Delete vid', function(done){
    api.get('/vrecipes')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err,res){
      expect(res.body).to.be.a('Array');
      expect(res.body.length).to.be.equal(0);
      done();
    });
  });

/* it('should be able to increase views of an existing vrecipe');
  it('should be able to increase likes of an existing vrecipe');
  it('should be able to increase displikes of an existing vrecipe');
  it('should be able to append a tags of an existing vrecipe');
  it('should be able to append a category of an existing vrecipe');
 */

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

  /*it('should get the couont of all videos');
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
  it('should get vrecipes of a given maxviews and minviews');*/
  after(function(done){
    //clean all loaded recipe data
    done();
  });


});




