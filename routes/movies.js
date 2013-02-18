var Movie = require('../models/movieSchema')
			, MovieSet = require('../models/movieSetSchema')
			, mongoose = require('mongoose');

exports.list = function(req, res) {
  var allMovies = Movie.find({}).exec(function (err, response) {
  	if (err) {
  		console.log("error", err);
  	} else {
  		console.log(response);
  		var movies = response.sort(['title', -1]);
  		res.render('movieList', {title: "All Movies", list: movies});
  	}
  });
};

exports.add = function(req, res) {
	var newSet = new MovieSet({});
	for (i=0; i<3; i++) {
		var newMovie = new Movie({title: req.body.title[i], genre: req.body.genre[i]});
		newSet.movieset.addToSet(newMovie);
		newSet.save(function(err) {
			if (err) {
				console.log("Error", err);
			}
		});
		newMovie.setIDs.addToSet(newSet);
		newMovie.save(function(err) {
			if (err) {
				console.log("Error", err);
			}
		});
	}
	res.redirect('/movies');
};

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
	res.redirect('/movies');
}