const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      requied: true,
      minlength: 10,
    },
    topic: {
      type: String,
      required: true,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      lowercase: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

articleSchema.virtual('comment_count', {
  ref: 'Comment',
  foreignField: 'article',
  localField: '_id',
  count: true,
});

articleSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'article',
  localField: '_id',
});

articleSchema.virtual('like_count').get(function () {
  return this.likes.length;
});

module.exports = mongoose.model('Article', articleSchema);
