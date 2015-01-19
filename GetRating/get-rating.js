var url = require('url');
var _ = require('underscore');
var request = require('request');
var express = require('express');
var app = express();

var PORT = process.argv[2];
var RT_API_KEY= process.argv[3];
var RT_URL = 
  'http://api.rottentomatoes.com/api/public/v1.0/movies.json?'
  + 'apikey=' + RT_API_KEY
  + '&page=1&page_limit=10';

var server = app.listen(PORT, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Rotten Tomatoes app listening at http://%s:%s', host, port);
})

app.get('/', function(req, res) {
  var urlParts = url.parse(req.url, true);
  var movie = urlParts.query.movie;
  var callback = urlParts.query.callback;

  if (!isSet(movie) || !isSet(callback)) {
    res.status(400).send('Query string is missing parameters');
  } else {
    var currentTimestamp = (new Date()).toString();
    console.log(currentTimestamp + ', Requesting RT ' + movie);
    var encodedMovie = encodeURIComponent(movie);
    
    var fetchRating = function(url, callback, response) {
      return function() {
        request(url, function(err, res, body) {
          response.send(callback + '(' + body + ')');
        });
      }
    }
    
    fetchRating(RT_URL+'&q='+encodedMovie, callback, res)();
    fetchRating = null;
  }
});

app.get('/imdb', function(req, res) {
  var urlParts = url.parse(req.url, true);
  var link = urlParts.query.link;

  if (!isSet(link)) {
    res.status(400).send('Query string is missing parameters');
  } else {
    var currentTimestamp = (new Date()).toString();
    console.log(currentTimestamp + ', Requesting IMDB ' + link);

    var fetchRating = function(url, response) {
      return function() {
        request(url, function(err, res, body) {
          var rating = /\d+\.\d\/10/.exec(body);

          response.send(rating);
        });
      }
    }

    fetchRating('http://'+link, res)();
    fetchRating = null;
  }
});

function isSet(s) {
  if (!_.isNull(s) && !_.isUndefined(s) && !_.isEmpty(s)) {
    return true;
  }
  return false;
}
