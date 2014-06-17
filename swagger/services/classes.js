var data = require('./sample-data.js');

exports.getAll = function getAllClasses() {
  return data.classes;
}

exports.getById = function getClassById(id) {
  return data.classes[id];
}

function createClass(newClass) {
  data.classes[newClass.id] = newClass;
}

function deleteAllClasses() {
  data.classes = [];
}

function deleteClassById(id) {
  delete data.classes[id];
}

function updateClass(updatedClass) {
  data.classes[updatedClass.id] = updatedClass;
}