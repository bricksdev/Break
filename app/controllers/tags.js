/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var localutils = require('../../lib/localutils');
/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') };
  var perPage = 5;
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  };

  Article.list(options, function(err, articles) {
    if (err) return res.render('500');
    Article.count(criteria).exec(function (err, count) {
      res.render('articles/index', {
        title: localutils.message('ET0001',{tag:req.param('tag')}),
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};
