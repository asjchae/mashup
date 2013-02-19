var Movie = require('../models/movieSchema')
			, MovieSet = require('../models/movieSetSchema')
			, mongoose = require('mongoose');

exports.list = function(req, res) {
  var allMovies = Movie.find({}).exec(function (err, response) {
  	if (err) {
  		console.log("error", err);
  	} else {
  		var movies = response.sort(['title', -1]);
  		var movies_id = response;
  		res.render('movieList', {title: "All Movies", list: movies}); // , ids: movies_id
  	}
  });
};

exports.add = function(req, res) {
	var newSet = new MovieSet({});
	for (var i=0; i<3; i++) {
		getMovie(i, req, newSet);
	}
	res.redirect('/movies/recommendations');
};

function getMovie(i, req, newSet) {
	Movie.findOne({title: req.body.title[i]}).exec(function (err, response) {
		if (err) {
			console.log("Error", err);
		} else if (!response) {
			var newMovie = new Movie({title: req.body.title[i], genre: req.body.genre[i]});
			newMovie.save(function(err) {
				if (err) {
					console.log("Error", err);
				}
			});
			processMovie(newMovie, newSet);
		} else {
			processMovie(response, newSet);
		}
	});
}

function processMovie(movie, newSet) {
	newSet.movieset.addToSet(movie);
	newSet.save(function (err) {
		if (err) {
			console.log("Error", err);
		}
	});
	movie.setIDs.addToSet(newSet);
	movie.save(function(err) {
		if (err) {
			console.log("Error", err);
		}
	});

	recEngine(newSet);
}

function recEngine(set) {
	for (i=0; i<3; i++) {
		callMovie(set.movieset[i]);
	}
}

function callMovie(movieid) {
	Movie.findOne({_id: movieid}).populate().exec(function (err, response) {
		if (err) {
			console.log("Error", err);
		} else {
			console.log(response);
		}
	})
}

exports.moviesets = function(req, res) {
	var allSets = MovieSet.find({}).populate({}).exec(function (err, response) {
		if (err) {
			console.log("error", err);
		} else {
			console.log(allSets);
			res.render('movieSetList', {title: "All Movie Sets", list: response})
		}
	});
}

exports.delete = function(req, res) {
	var delMovies = Movie.find({}).remove();
	var delMovieSets = MovieSet.find({}).remove();
	res.redirect('/movies');
}