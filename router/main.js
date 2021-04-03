var express = require('express');
var app=express()
var router = express.Router();
var path=require('path')

router.get('/', function(req,res){
    console.log('asdasdad')
    res.sendFile(path.join(__dirname+'/../login/login.html'));
});

module.exports = router;