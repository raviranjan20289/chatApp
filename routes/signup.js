const express = require('express');

const router = express.Router();

const userController = require('../controllers/signup');

router.post('/signUp',userController.postSignup);

module.exports = router ;