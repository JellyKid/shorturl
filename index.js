var db = require('./db');
var model = require('./data/model');
var validUrl = require('valid-url');


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('db shorturl connected');
});

function setDefaults(req, res, next) {
  if(/\/(.)/.test(req.path)){
    req.parsedPath = /\/(.+)/.exec(req.path)[1];
    req.shortUrlPath = req.protocol + '://' + req.hostname + req.baseUrl +'/';
    return next();
  } else {
    res.status(404).send('No path found!');
  }
}

function checkUrlDb(req,res,next){
    model.findOne({URL: req.parsedPath},function(err, existingUrl){
      if(err){
        return next(new Error(err));
      }
      if(existingUrl){
        res.send({
          original_url: req.parsedPath,
          short_url: req.shortUrlPath + existingUrl.id
        });
      } else {
        next();
      }
    });
}

function checkShortDb(req, res, next) {
  model.findById(req.parsedPath,function(err, existingShortUrl){
    if(err){
      return next(new Error(err));
    }
    if(existingShortUrl){
      res.redirect(302, existingShortUrl.URL);
    } else {
      next();
    }
  });
}

function newURl(req, res, next){
  if(validUrl.isUri(req.parsedPath)){
    var newShortURL = new model({URL: req.parsedPath});
    newShortURL.save(function(err,short){
      if(err){
        return next(new Error(err));
      }
      res.send({
        original_url: req.parsedPath,
        short_url: req.shortUrlPath + short.id
      });
    });
  } else {
    res.send({
      request: req.parsedPath,
      error: "Invalid URL or shortcode"
    });
  }
}

module.exports = {
  setDefaults: setDefaults,
  checkUrlDb: checkUrlDb,
  checkShortDb: checkShortDb,
  newURl: newURl
};
