var express = require('express');
var router = express.Router();
var models = require('../../models');

/* GET types listing. */
router.get('/', async function(req, res, next) {
    let types = await models.Type.findAll();    
    res.render('admin/user/index', { title: 'User Types Lists', types:types });
});

/* GET users create. */
router.get('/create', function(req, res, next) {
    res.render('admin/user/create', { title: 'Create New User' });
});

/* post users create. */
router.post('/create', function(req, res, next) {
    let data = req.body;
    backURL=req.header('Referer') || '/';  
    
    let errors = validationResult(req);
    
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
    res.render('admin/user/edit', { title: 'Edit User Data.', 'user': user });
});

/* post users update. */
router.post('/edit/:id',function(req, res, next) {
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

/* GET users edit page. */
router.get('/view/:id',async function(req, res, next) {
    let id = req.params.id;
    let user = await models.User.findOne({'where':{'id':id}});
    res.render('admin/user/view', { title: 'View Detail User Data.', 'user': user });
});

module.exports = router;