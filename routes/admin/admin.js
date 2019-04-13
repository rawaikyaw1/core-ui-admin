var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'Admin Login' });
});

/* POST login form. */
router.post('/login', function(req, res, next) {
  res.redirect('/admin/users');
});

module.exports = router;
