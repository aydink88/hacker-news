const express = require('express');
const { check } = require('express-validator');
const articleController = require('../controllers/articles');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const articleValidator = [
  check('title', 'Title is required').not().isEmpty(),
  check('text', 'Please include content (at least 10 characters).').isLength({
    min: 10,
  }),
  check('topic', 'Topic is required').not().isEmpty(),
];

router.get('/', articleController.getArticles);
router.post('/', checkAuth, articleValidator, articleController.createArticle);
router.patch('/like/:aid', checkAuth, articleController.likeArticle);
router.patch('/unlike/:aid', checkAuth, articleController.unlikeArticle);
router.get('/topic/:tslug', articleController.getArticlesByTopic);
router.get('/user/:uid', articleController.getArticlesByUser);
router.get('/:aid', articleController.getArticleById);
router.post('/:aid/comments', checkAuth, articleController.createComment);
router.get('/:aid/comments', articleController.getCommentsByArticle);
router.patch('/comments/like/:cid', checkAuth, articleController.likeComment);
router.patch('/comments/unlike/:cid', checkAuth, articleController.unlikeComment);
router.delete('/comments/:cid', checkAuth, articleController.deleteComment);
router.patch('/:aid', checkAuth, articleController.updateArticle);
router.delete('/:aid', checkAuth, articleController.deleteArticle);

module.exports = router;
