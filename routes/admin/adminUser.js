var express = require('express');
var router = express.Router();
var models = require('../../models');
var bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let users = await models.User.findAll({
        include:[
            models.Type
          ]
    });
    res.render('admin/user/index', { title: 'User Lists', users:users});
});

/* GET users create. */
router.get('/create',async function(req, res, next) {
    let types = await models.Type.findAll();
    res.render('admin/user/create', { title: 'Create New User', types:types });
});

/* post users create. */
router.post('/create',[
    check('firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long.'),
    check('lastName').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long.'),
    check('email').isEmail().withMessage('Valid email address is required.'),
    check('password').isLength({ min: 6 }).withMessage('Your password must be at last 6 characters longs.'),
    check('confirmPassword').isLength({ min: 6 }).withMessage('Your confirm password must be at last 6 characters longs.'),
], function(req, res, next) {
    let data = req.body;
    backURL=req.header('Referer') || '/';  
    
    let errors = validationResult(req);
    // console.log(errors.array()[0].firstName);
    if (!errors.isEmpty()) {        
        if(data.password !== data.confirmPassword){
            errors.array().concat({'msg': 'Your password & confirmation password must be same.'});
        }    
        req.flash("warning" , errors.array());
        return res.redirect(backURL);
    }

    if(data.password !== data.confirmPassword){
        req.flash("warning" , {'msg': 'Your password & confirmation password must be same.'});
        return res.redirect(backURL);
    }
    
    var saltRount = 10;
    var salt = bcrypt.genSaltSync(saltRount);
    var hash = bcrypt.hashSync(data.password, salt);
    data.password = hash;

    models.User.create(data).then((err, result)=>{
        req.flash("success" , 'User successfully created.');
        res.redirect('/admin/users');
    });
});

/* post users delete. */
router.post('/delete', function(req, res, next) {
    let data = req.body;    
    models.User.destroy({where:{id:data.id}}).then((err, result)=>{
        req.flash("info" , 'User successfully deleted.');
        res.redirect('/admin/users');
    });
    
});

/* GET users edit page. */
router.get('/edit/:id',async function(req, res, next) {
    let id = req.params.id;
    let user = await models.User.findOne({'where':{'id':id}});
    let types = await models.Type.findAll();
    res.render('admin/user/edit', { title: 'Edit User Data.', 'user': user, types:types });
});

/* post users update. */
router.post('/edit/:id',[
    check('firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long.'),
    check('lastName').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long.'),
], function(req, res, next) {
    let data = req.body;
    let id = req.params.id;
    backURL=req.header('Referer') || '/';  
    
    let errors = validationResult(req);
    
    if (!errors.isEmpty()) {        
        
        req.flash("warning" , errors.array());
        return res.redirect(backURL);
    }

    if(data.password){
        if(data.password !== data.confirmPassword){
            req.flash("warning" , {'msg': 'Your password & confirmation password must be same.'});
            return res.redirect(backURL);
        }
        
        var saltRount = 10;
        var salt = bcrypt.genSaltSync(saltRount);
        var hash = bcrypt.hashSync(data.password, salt);
        data.password = hash;
    }

    models.User.update(data, {where:{'id':id}}).then((err, result)=>{
        req.flash("success" , 'User successfully update.');
        res.redirect('/admin/users');
    });
});

/* GET users view page. */
router.get('/view/:id',async function(req, res, next) {
    let id = req.params.id;
    let user = await models.User.findOne({'where':{'id':id}});
    res.render('admin/user/view', { title: 'View Detail User Data.', 'user': user });
});

module.exports = router;