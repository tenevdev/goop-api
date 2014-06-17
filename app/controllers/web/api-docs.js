exports.index = function(req, res) {
  res.render('api-docs/index', {
    title: 'Goop Web API'
  });
};