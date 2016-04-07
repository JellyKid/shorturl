var mongoose = require('mongoose');
var shortid = require('shortid');

var shortURLScheme = mongoose.Schema({
  URL: {
    type: String,
    required: true
  },
  _id: {
    type: String,
    'default': shortid.generate
  }
});

var ShortURL = mongoose.model('ShortURL', shortURLScheme);

module.exports = ShortURL;
