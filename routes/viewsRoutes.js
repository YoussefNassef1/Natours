const express = require('express');

const router = express.Router();
const bookingController = require('../controller/bookingController');
const viewsController = require('../controller/viewsController');
const authController = require('../controller/authController');

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverView
);
router.get('/tours/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/my-tours', authController.protect, viewsController.getMyTour);

router.route('/login').get(authController.isLoggedIn, viewsController.getLogin);
router.get('/me', authController.protect, viewsController.getAccount);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);
module.exports = router;
