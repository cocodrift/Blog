const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  content: String,
  comments: [{ body: String, date: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
