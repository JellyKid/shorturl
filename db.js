var mongodb = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/short');

module.exports = mongoose.connection;
