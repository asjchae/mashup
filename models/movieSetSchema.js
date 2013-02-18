var mongoose = require('mongoose');

var movieSetSchema = mongoose.Schema({
	movieset: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

var MovieSet = mongoose.model('MovieSet', movieSetSchema);

module.exports = MovieSet;