const mongoose = require('mongoose');
const instagramSchema = new mongoose.Schema({
    postUrl: String
});
module.exports = mongoose.model('Insta', instagramSchema);
