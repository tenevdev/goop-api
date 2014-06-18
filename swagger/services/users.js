var data = require('./sample-data.js');

exports.getById = function(id){
	return data.users[id];
}

exports.getByEmail = function(user){
	for(var id in data.users){
		if(data.users[id].email === user.email && data.users[id].password === user.password)
			return data.users[id];
	}
	return null;
}