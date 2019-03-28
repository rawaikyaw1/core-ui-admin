var express = require('express');
var router = express.Router();
var models = require('../../models');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let users = await models.User.findAll();
    console.log(users);
    res.render('admin/user/index', { title: 'User Lists', users:users });
});

/* GET users create. */
router.get('/create', function(req, res, next) {
    res.render('admin/user/create', { title: 'Create New User' });
});

/* GET users create. */
router.post('/create', function(req, res, next) {
    let data = req.body;

    models.User.create(data).then((err, result)=>{
        req.flash("success" , 'User successfully created.');
        res.redirect('/admin/users');
    });
});

module.exports = router;
