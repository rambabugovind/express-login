var express = require('express');
var router = express.Router();
let bcrypt = require('bcryptjs');
let user = require('../db_models/user-model');

router.get('/',function(req,res,next) {
    res.render('register', {csrfToken: req.csrfToken()});
});

router.post('/', function(req,res,nxt) {
    let hash = bcrypt.hashSync(req.body.password,14);
    req.body.password = hash;
    let new_user = user(req.body);
    // res.send(new_user);
    new_user.save((err) => {
        if(err) {
            let error = err;
            if(err.code === 11000) {
                error = "The email is already taken. Try another email!";
            }
            return res.render('register',{error:error});
        }
        res.redirect('/');
    });
});

module.exports = router;