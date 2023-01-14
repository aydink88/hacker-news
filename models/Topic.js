const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, lowercase: true, required: true },
});

module.exports = mongoose.model('Topic', TopicSchema);
