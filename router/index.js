var express = require('express');
var app=express()
var router = express.Router();
var path=require('path');
var main = require('./main')
var id = require('./id')
var board = require('./board')
router.get('/', function(req,res){
    console.log('asdasdad')
    res.sendFile(path.join(__dirname+'/../login/login.html'));
});

router.use('/user',id)
router.use('/board',board)

module.exports=router;