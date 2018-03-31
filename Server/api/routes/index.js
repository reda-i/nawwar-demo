/* eslint-disable max-len */
/* eslint-disable max-statements */

var express = require('express');
var router = express.Router();

var productCtrl = require('../controllers/ProductController');
var ActivityController = require('../controllers/ActivityController');
var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');
var adminController = require('../controllers/AdminController');


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
};

var isUnAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
};

module.exports = function (passport) {

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.send('Server Works');
  });

  // --------------Product Controller---------------------- //
  router.get('/market/getMarketPage/:entriesPerPage/:' +
    'pageNumber/:name/:price', productCtrl.getMarketPage);
  router.get(
    '/market/getNumberOfProducts/:name/:price',
    productCtrl.getNumberOfProducts
  );
  router.get('/product/getProduct/:productId', productCtrl.getProduct);
  router.post('/productrequest/createproduct', productCtrl.createProduct);
  router.post('/productrequest/' +
    'createProductRequest', productCtrl.createProductRequest);
  router.post('/productrequest/evaluateRequest', productCtrl.evaluateRequest);
  router.get('/productrequest/getRequests', productCtrl.getRequests);
  // --------------End Of Product Contoller ---------------------- //

  // --------------------- Activity Contoller -------------------- //
  router.get('/activities', ActivityController.getActivities);
  // --------------------- End of Activity Controller ------------ //

  // ---------------------- User Controller ---------------------- //
  router.post('/signup', isUnAuthenticated, passport.authenticate('local-signup'));
  router.post('/signin', isUnAuthenticated, passport.authenticate('local-signin'));
  // ---------------------- End of User Controller --------------- //

  // -------------- Admin Contoller ---------------------- //
  router.get('/admin/PendingContentRequests', adminController.viewPendingReqs);
  router.get('/admin/VerifiedContributerRequests', adminController.getVCRs);
  // --------------End Of Admin Contoller ---------------------- //


  //-------------------- Profile Module Endpoints ------------------//
  router.post('/profile/VerifiedContributerRequest', profileController.requestUserValidation);
  router.get('/profile/:username', profileController.getUserInfo);
  //------------------- End of Profile module Endpoints-----------//


  // --------------Content Module Endpoints---------------------- //
  router.get(
    '/content/getContentPage/:numberOfEntriesPerPage' +
    '/:pageNumber/:category/:section',
    contentController.getContentPage
  );
  router.get(
    '/content/numberOfContentPages/:numberOfEntriesPerPage/:category/:section',
    contentController.getNumberOfContentPages
  );

  module.exports = router;

  return router;
};