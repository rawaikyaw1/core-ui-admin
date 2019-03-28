var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'Admin Login' });
});


module.exports = router;
