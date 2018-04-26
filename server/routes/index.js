var express = require('express');
var router = express.Router();
let user = require('../db_models/user-model');
let bcrypt = require('bcryptjs');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{csrfToken:req.csrfToken()});
});

router.post('/',function(req,res,next) {
  user.findOne({username: req.body.username},(err,user)=>{
    if(err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.render('index',{error: "Incorrect email/password"});
    }
    req.session.userId = user._id;
    res.redirect('/home');
  });
});

module.exports = router;
