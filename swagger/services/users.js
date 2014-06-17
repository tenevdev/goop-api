var data = require('./sample-data.js');

exports.getById = function(id){
	return data.users[id];
}