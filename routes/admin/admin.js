var express = require('express');
var router = express.Router();
var auth = require('connect-ensure-login').ensureLoggedIn;
var passport = require('passport');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'Admin Login' });
});

/* POST login form. */
// router.post('/login', function(req, res, next) {
//   res.redirect('/admin/users');
// });

router.post('/login', passport.authenticate('local',{
  successRedirect: '/admin/users',
  failureRedirect: '/admin',
  failureFlash : true
}),
function(req, res, next){
  // res.redirect('/notes');
});

router.get('/logout', auth('/admin'), function(req, res){
  req.logout();
  return res.redirect('/');
})

module.exports = router;
