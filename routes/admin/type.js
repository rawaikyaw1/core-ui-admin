var express = require('express');
var router = express.Router();
var models = require('../../models');
const { check, validationResult } = require('express-validator/check');
const config = require('./../../config/config.json');
var auth = require('connect-ensure-login').ensureLoggedIn;


/* GET types listing. */
router.get('/', auth('/admin'), async function(req, res, next) {
    
    let types = await models.Type.findAll(); 
    let permissions = config.permissions;
    res.render('admin/type/index', { title: 'Type Lists', types:types,permissions:permissions });

});

/* GET type create. */
router.get('/create', auth('/admin'), function(req, res, next) {
    let permissions = config.permissions;
    res.render('admin/type/create', { title: 'Create New Type', permissions:permissions });
});

/* post type create. */
router.post('/create', auth('/admin'), [
    check('name').isLength({ min: 3 }).withMessage('Type field is required!'),
],function(req, res, next) {
    
    let errors = validationResult(req);
    
    if (!errors.isEmpty()) { 
        req.flash("warning" , errors.array());
        return res.redirect(backURL);
    }

    let data = req.body;    
    let permission = [];

    (data.create? permission.push('create'): ''); 
    (data.detail? permission.push('detail'): ''); 
    (data.update? permission.push('update'): ''); 
    (data.delete? permission.push('delete'): '');
    
    data.permission = JSON.stringify(permission);
    
    backURL=req.header('Referer') || '/';

    models.Type.create(data).then((err, result)=>{
        req.flash("success" , 'Type successfully created.');
        res.redirect('/admin/type');
    });

});

/* post type delete. */
router.post('/delete', auth('/admin'), function(req, res, next) {
    let data = req.body;    
    models.Type.destroy({where:{id:data.id}}).then((err, result)=>{
        req.flash("info" , 'Type successfully deleted.');
        res.redirect('/admin/type');
    });
    
});

/* GET type edit page. */
router.get('/edit/:id', auth('/admin'), async function(req, res, next) {
    let id = req.params.id;
    let type = await models.Type.findOne({'where':{'id':id}});
    let permissions = config.permissions;
    res.render('admin/type/edit', { title: 'Edit Type Data.', 'type': type, permissions:permissions });
});

/* post type update. */
router.post('/edit/:id', auth('/admin'), [
    check('name').isLength({ min: 3 }).withMessage('Type field is required!'),
],function(req, res, next) {
    let data = req.body;
    let id = req.params.id;
    backURL=req.header('Referer') || '/';  
    
    let errors = validationResult(req);
    
    if (!errors.isEmpty()) { 
        req.flash("warning" , errors.array());
        return res.redirect(backURL);
    }
    
    let permission = [];
    (data.create? permission.push('create'): ''); 
    (data.detail? permission.push('detail'): ''); 
    (data.update? permission.push('update'): ''); 
    (data.delete? permission.push('delete'): '');
    data.permission = JSON.stringify(permission);

    models.Type.update(data, {where:{'id':id}}).then((err, result)=>{
        req.flash("success" , 'Type successfully update.');
        res.redirect('/admin/type');
    });

});

/* GET type view page. */
router.get('/view/:id', auth('/admin'), async function(req, res, next) {
    let id = req.params.id;
    let type = await models.Type.findOne({'where':{'id':id}});
    let permissions = config.permissions;
    res.render('admin/type/view', { title: 'View Detail Type Data.', 'type': type, permissions:permissions });
});

module.exports = router;