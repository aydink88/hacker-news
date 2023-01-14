const express = require('express');
const topicController = require('../controllers/topics');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', topicController.getTopics);
router.post('/', checkAuth, topicController.createTopic);
router.patch('/:tslug', checkAuth, topicController.updateTopic);
router.delete('/:tslug', checkAuth, topicController.deleteTopic);

module.exports = router;
