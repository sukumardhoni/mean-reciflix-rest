'use strict';


describe('reciflixe meanjs', function () {


  it('should redirect to home page', function () {
    browser.driver.manage().window().maximize();
    browser.get('http://localhost:3000/#!/');
    //expect(browser.getTitle()).toBe('MEAN.JS - Development Environment');
    //expect(browser.getTitle()).toBe('GTM PROGRESS SITE - Development Environment');

    browser.sleep(3000);
  });




});
