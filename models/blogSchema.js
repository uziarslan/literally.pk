const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        filename: String,
        path: String
    }
});

module.exports = mongoose.model('Blog', blogSchema);
