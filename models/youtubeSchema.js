const mongoose = require('mongoose');

const youtubeSchema = new mongoose.Schema({
    postUrl: String,
    postTitle: String,
    postDescription: String
});

module.exports = mongoose.model('Youtube', youtubeSchema);