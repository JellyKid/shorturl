var db = require('./db');
var model = require('./data/model');
var validUrl = require('valid-url');


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('db connected');
});

function redirect(url) {

}


module.exports = function(req,res){
  if(req.path === '/'){
    res.send('Insert directions here');
    return;
  }
  var path = /^\/(.+)/.exec(req.path)[1];
  model.findOne({URL: path},function(err, existingUrl){ //find url already in database
    if(err){
      console.log(err);
      return err;
    }
    if(existingUrl){
      res.send({
        original_url: path,
        short_url: "http://" + req.get('host') + "/short/" + existingUrl.id
      });
    } else {
      model.findById(path,function(err, existingShortUrl){ //find shortcode
        if(err){
          console.log(err);
          return err;
        }
        if(existingShortUrl){
          res.redirect(302, existingShortUrl.URL);
        } else {
          if(validUrl.isUri(path)){
            var newShortURL = new model({URL: path});
            newShortURL.save(function(err,short){
              if(err){
                res.send({
                  request: path,
                  error: err
                });
              } else {
                res.send({
                  original_url: path,
                  short_url: "http://" + req.get('host') + "/short/" + short.id
                });
              }
            });

          } else {
            res.send({
              request: path,
              error: "Invalid URL or shortcode"
            });
          }
        }
      });
    }
  });
};
