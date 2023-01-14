const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/async-handler');
const AppError = require('../utils/app-error');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const slug = require('../utils/slug');
const paginate = require('../utils/paginate');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get all articles
// /api/v1/articles, GET, public
exports.getArticles = asyncHandler(async (req, res) => {
  const { limit, page } = req.query;
  const query = Article.find()
    .select('-text')
    .populate('comment_count')
    .populate({ path: 'author', select: 'username' });

  const articles = await paginate(query, page, limit).exec();

  return res.status(200).json({ articles });
});

// Get one article by Id
// /api/v1/articles/aid, GET, public
exports.getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.aid)
    .populate('comments')
    .populate({ path: 'author', select: '-password' });
  res.status(200).json({ article });
});

// Get articles by slug
// /api/v1/articles/topic/:tslug GET PUBLIC
exports.getArticlesByTopic = asyncHandler(async (req, res, next) => {
  const articles = await Article.find({ topic: req.params.tslug });
  if (articles.length === 0) {
    return next(new AppError('No article found', 404));
  }
  return res.status(200).json({ articles });
});

// Get articles by user
// /api/v1/articles/user/:uid GET PUBLIC
exports.getArticlesByUser = asyncHandler(async (req, res, next) => {
  const articles = await Article.find({ author: req.params.uid });
  if (articles.length === 0) {
    return next(new AppError('No article found', 404));
  }
  return res.status(200).json({ articles });
});

// Create an article
// /api/v1/articles/, POST, private
exports.createArticle = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Inputs do not meet requirements', 422));
  }

  const newArticle = {
    title: req.body.title,
    text: req.body.text,
    topic: slug(req.body.topic),
    author: req.userData.userId,
  };

  const article = await Article.create(newArticle);
  return res.status(201).json({ article });
});

// Update an article
// /api/v1/articles/aid, PATCH, private
exports.updateArticle = asyncHandler(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'title', 'text', 'topic');

  const article = await Article.findById(req.params.aid);
  if (article.author.toString() !== req.userData.userId && req.userData.role !== 'admin') {
    return next(new AppError('Not your article', 403));
  }

  Object.keys(filteredBody).forEach((el) => {
    article[el] = filteredBody[el];
  });
  await article.save();

  return res.status(200).json({ article });
});

// Delete an article
// /api/v1/articles/aid, DELETE, private
exports.deleteArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.aid);

  if (article.author.toString() !== req.userData.userId && req.userData.role !== 'admin') {
    return next(new AppError('Not your article', 403));
  }

  await Article.deleteOne(article);
  return res.status(204).json({ success: true, data: 'article deleted' });
});

exports.likeArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.aid);

  if (article.likes.some((like) => like.user.toString() === req.userData.userId)) {
    return next(new AppError('You already liked', 400));
  }
  article.likes.unshift({ user: req.userData.userId });
  await article.save();

  return res.status(200).json({ article });
});

exports.unlikeArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.aid);
  if (!article.likes.some((like) => like.user.toString() === req.userData.userId)) {
    return next(new AppError('Article has not been liked yet', 400));
  }
  article.likes = article.likes.filter((like) => like.user.toString() !== req.userData.userId);
  await article.save();
  return res.status(200).json({ article });
});

exports.createComment = asyncHandler(async (req, res) => {
  const comment = new Comment({
    text: req.body.text,
    user: req.userData.userId,
    article: req.params.aid,
  });
  await comment.save();
  res.status(201).json({ comment });
});

exports.getCommentsByArticle = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ article: req.params.aid });
  if (comments.length === 0) {
    return next(new AppError('No comment written yet', 404));
  }
  return res.status(200).json({ comments });
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.cid);
  if (comment.user.toString() !== req.userData.userId && req.userData.role !== 'admin') {
    return next(new AppError('Not your comment', 403));
  }
  await Comment.deleteOne(comment);
  return res.status(204).json({ comment });
});

exports.likeComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.cid);

  if (comment.likes.some((like) => like.user.toString() === req.userData.userId)) {
    return next(new AppError('You already liked', 400));
  }
  comment.likes.unshift({ user: req.userData.userId });
  await comment.save();

  return res.status(200).json({ comment });
});

exports.unlikeComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.cid);
  if (!comment.likes.some((like) => like.user.toString() === req.userData.userId)) {
    return next(new AppError('Comment has not been liked yet', 400));
  }
  comment.likes = comment.likes.filter((like) => like.user.toString() !== req.userData.userId);
  await comment.save();
  return res.status(200).json({ comment });
});
