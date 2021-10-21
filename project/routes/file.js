var express = require('express');
var router = express.Router();

const {models} = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {


  console.log(req.session.passport.user);
  res.render('file', { title: 'Express' });
});

module.exports = router;
