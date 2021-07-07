const express = require('express');
const router = express.Router();
const userControl = require('./routeConfig/userControls');
const authenticate = require('./middlewares/authenticate');

//storing user data in db
router.post('/register', userControl.register )
router.get('/refresh_token', userControl.refreshToken)
router.post('/login', userControl.login)
router.get('/logout', userControl.logout)

//info of the user authenticated after verifying
router.get('/info', authenticate,  userControl.getUser)

module.exports = router;