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
  
  it('should be able to retrive a saved vrecipe by id: ', function(done){
    api.get('/vrecipes/'+vrecipeID)

    .expect(200)
    .end(function(err, res){
      expect(err).to.equal(null);
      expect(res.body).to.have.a.property('title');
      expect(res.body.title).to.equal('Test Video receipe 1');
			expect(res.body).to.have.a.property('videoId');
			expect(res.body.videoId).to.equal('VIDEOID1');
		var tags = expect(res.body.tags).to.contain('chicken','nonveg');
			 console.log('Updated Tags' + JSON.stringify(tags));
      done();
    });
  });


	it('should get the video related to Tag chicken', function (done) {
		api.get('/VRecipesByTags/chicken')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function (err, res) {
       expect(err).to.equal(null);
			 expect(res.body).to.be.a('Array');
       expect(res.body.length).to.be.equal(1);
			 expect(res.body[0].videoId).to.equal('VIDEOID1');
		   done();
			});
	});

	it('should get the video related to Tag Curry', function (done) {
		api.get('/VRecipesByTags/Curry')
			.set('Accept', 'application/json')
			.expect(204)
			.end(function (err, res) {
       expect(err).to.equal(null);
		   done();
			});
	});

    it('should be able to Update an existing vrecipe' ,function(done){
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
	      expect(res.body).to.have.a.property('title');
	      expect(res.body.title).to.equal('Global Tech Minds');
	      expect(res.body.videoId).to.equal('GTMVIDEOID1');
	      expect(res.body.submitted.date).to.not.equal(null);
	      expect(res.body).to.have.property('views');
				expect(res.body.views).to.equal(10000);
				expect(res.body.likes).to.equal(1000);
			  expect( res.body.dislikes).to.equal(13);
				expect(res.body.tags).to.contain('Curry');
			  expect(res.body.tags.length).to.be.equal(4);
	      done();
       });
		});

	it('should get all videos related to Tags Curry', function (done) {
		api.get('/VRecipesByTags/Curry')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function (err, res) {
       expect(err).to.equal(null);
			 expect(res.body).to.be.a('Array');
       expect(res.body.length).to.be.equal(1);
			 expect(res.body[0].videoId).to.equal('GTMVIDEOID1');
			 expect(res.body[0].likes).to.equal(1000);
		   done();
			});
	});




	it('should be able to Delete a vrecipe by id',function(done){
		  api.delete('/vrecipes/'+vrecipeID)
    .expect(200)
    .end(function(err, res){
      expect(err).to.equal(null);

      done();
    });
	});

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
		//load a set of test recipe data  ( 100 vrecipes)
			api.post('/initialize')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err,res){
      done();
    });


  });
  it('should bring an all recipee vrecipes Count', function(done){
    api.get('/vrecipes')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err,res){
      expect(res.body).to.be.a('Array');
      expect(res.body.length).to.be.equal(125);
      done();
    });
  });

	it('should get all tags', function(done){
    api.get('/Vrecipes/Categories/tags/1')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err,res){
			expect(err).to.be.a('null');
      expect(res.body).to.be.a('Array');
     expect(res.body.length).to.be.equal(46);
      done();
    });
  });

	it('should get categories by a pagenum', function(done){
    api.get('/vRecipesAllCategories/1')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err,res){
			expect(err).to.be.a('null');
      expect(res.body).to.be.a('Array');
			expect(res.body.length).to.be.equal(12);
      done();
    });
  });

	it('should get the video related to Tag chicken', function (done) {
		api.get('/VRecipesByTags/Chicken')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function (err, res) {
       expect(err).to.equal(null);
			 expect(res.body).to.be.a('Array');
       expect(res.body.length).to.be.equal(1);
			 expect(res.body[0].tags).to.contain('Chicken');
			 expect(res.body[0].videoId).to.equal('LUKEX8qyTc0');
		   done();
			});
	});

	it('should get vrecipes videos by category by a pagenum', function (done) {
		api.get('/VRecipesByCategories/Non-Veg/1')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function (err, res) {
       expect(err).to.equal(null);
			 expect(res.body).to.be.a('Array');
       expect(res.body.length).to.be.equal(1);
			 expect(res.body[0].tags).to.contain('Chicken', 'Non-veg', 'Fry', 'Curry').to.have.length.above(2);
			 expect(res.body[0].categories).to.contain('Non-Veg');
		   done();
			});
	});



	it('should get vrecipes of a given maxviews and minviews', function (done) {
		api.get('/VRecipesByViews/1/100000')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function (err, res) {
       expect(err).to.equal(null);
			 expect(res.body).to.be.a('Array');
       expect(res.body.length).to.be.equal(90);
			 expect(res.body[0].tags).to.contain('Snacks','Sweets');
			 expect(res.body[0].categories).to.contain('Appetizers');
			 expect(res.body[45].tags).to.contain('Healthy');
			 expect(res.body[45].categories).to.contain('Healthy Diet');
			 expect(res.body[89].tags).to.contain('Soup' , 'Veg');
			 expect(res.body[89].categories).to.contain('Chutneys and Soups');
			 done();
			});
		 });


it('should get vrecipes of a give maxvies, minviews,maxlikes, minlikes and tags', function (done) {
		api.get('/VRecipesByViewsAndTags/20000/100/500/100/Chicken')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function (err, res) {
       expect(err).to.equal(null);
			 expect(res.body).to.be.a('Array');
       expect(res.body.length).to.be.equal(1);
			 expect(res.body[0].tags).to.include('Chicken', 'Non-veg', 'Fry', 'Curry');
			 expect(res.body[0].categories).to.include('Non-Veg');
		   done();
			});
		 });

	it('should get favourite vrecipes by vid', function (done) {
	api.get('/myFavoritesVRecipes/LUKEX8qyTc0')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function (err, res) {
       expect(err).to.equal(null);
			 expect(res.body).to.be.a('Array');
       expect(res.body.length).to.be.equal(1);
			 expect(res.body[0].tags).to.include('Chicken', 'Non-veg', 'Fry', 'Curry');
			 expect(res.body[0].categories).to.include('Non-Veg');
		   done();
			});
		 });

	it('should get favourite vrecipes by userid');
  it('should be able to add favourite vrecipes for a userid');
  it('should be able to remove favourite vrecipes for a userid');
  it('should bea able to not see newly removed vrecipe on the favourite vrecipes by userid');


  after(function(done){
    //clean all loaded recipe data
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




