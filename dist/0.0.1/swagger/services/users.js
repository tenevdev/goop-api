var data = require('./sample-data.js');

function getClass(classObj) {
  return (classObj.author == this);
}

function deleteClass(classObj, index, array) {
  if (classObj.author == this)
    delete array[index];
}

exports.getById = function(id) {
  return data.users[id];
}

exports.getByEmail = function(user) {
  for (var id in data.users) {
    if (data.users[id].email === user.email)
      return data.users[id];
  }
  return null;
}

exports.getClasses = function(id) {
  if (data.users[id])
    return data.classes.filter(getClass, id);
  return null;
}

exports.post = function(user) {
  if (this.getByEmail(user) || data.users[user.id])
    return null;
  data.users[user.id] = user;
  return user;
}

exports.delete = function(id) {
  if (data.users[id]) {
    delete data.users[id];
    return true;
  }
  return null;
}

exports.deleteClasses = function(id) {
  if (data.users[id]) {
    data.classes.forEach(deleteClass, id);
    return true;
  } else {
    return null;
  }
}

exports.update = function(user) {
  if (data.users[user.id]) {
    data.users[user.id] = user;
    return user;
  }
  return null;
}