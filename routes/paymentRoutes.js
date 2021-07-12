const express = require('express');
const router = express.Router();
const paymentControls = require('./routeConfig/paymentControls')
const authenticate = require('./middlewares/authenticate');
const adminAuth = require('./middlewares/adminAuth');


router.route('/payment')
    .get(authenticate, adminAuth, paymentControls.getPayments)
    .post(authenticate, paymentControls.createPayment);


module.exports = router;