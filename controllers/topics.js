const asyncHandler = require('../utils/async-handler');
const AppError = require('../utils/app-error');
const slug = require('../utils/slug');
const Topic = require('../models/Topic');

exports.getTopics = asyncHandler(async (_req, res, next) => {
  const topics = await Topic.find();
  if (topics.length === 0) {
    return next(new AppError('No topic found', 404));
  }
  return res.status(200).json({ topics });
});

exports.createTopic = asyncHandler(async (req, res, next) => {
  if (req.userData.role !== 'admin') {
    return next(new AppError('You are not authorized', 403));
  }
  const topic = await Topic.create({
    title: req.body.title,
    slug: slug(req.body.title),
  });
  return res.status(201).json({ topic });
});

exports.updateTopic = asyncHandler(async (req, res, next) => {
  if (req.userData.role !== 'admin') {
    return next(new AppError('You are not authorized', 403));
  }
  const topic = await Topic.findOneAndUpdate(
    { slug: req.params.tslug },
    { title: req.body.title, slug: slug(req.body.title) },
  );
  return res.status(200).json({ topic });
});

exports.deleteTopic = asyncHandler(async (req, res, next) => {
  if (req.userData.role !== 'admin') {
    return next(new AppError('You are not authorized', 403));
  }
  await Topic.findOneAndDelete({ slug: req.params.tslug });
  return res.status(204).json({ message: 'topic deleted' });
});
