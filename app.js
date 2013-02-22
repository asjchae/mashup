
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , movies = require('./routes/movies');

var app = express();
mongoose.connect(process.env.MONGOLAB_URI || 'localhost/movies');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// GET requests
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/movies', movies.list);
app.get('/movies/delete', movies.delete);
app.get('/moviesets', movies.moviesets);
app.get('/movies/genres', movies.genres);
app.get('/movies/genres/:genre', movies.genreSort);

// POST requests
app.post('/movies/recommendations', movies.recommendations);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
