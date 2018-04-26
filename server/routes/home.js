var express = require('express');
var router = express.Router();
let user = require('../db_models/user-model');


router.get('/',function(req,res,nxt) {
    if(!(req.session && req.session.userId)) {
        return res.redirect('/');
    }
    user.findById(req.session.userId,(err,user) => {
        if(err){
            return nxt(err);
        }
        if(!user){
            return res.redirect('/');
        }
        res.render('home');
    });
});

module.exports = router;