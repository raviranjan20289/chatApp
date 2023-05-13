const express = require('express');

const router = express.Router();

const userAuth = require('../middleware/auth');
const groupController = require('../controllers/groupController');

router.get('/getGroups', userAuth.authenticate, groupController.getGroups);

router.post('/createGroup', userAuth.authenticate, groupController.addGroup);

router.post('/joinGroup/:groupId', userAuth.authenticate, groupController.addMembers);

module.exports = router ;