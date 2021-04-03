var express = require('express');
var fs=require('fs');
var url = require('url');
var mysql=require('mysql');
var router = require('./router/index');
const session = require('express-session')
const MySQLStore=require('express-mysql-session')(session);


var app = express();
var bodyParser = require('body-parser');

app.use(session({
	secret: 'pleasepleaseplease',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host : 'localhost',
        user : 'root',
        password : '9977',
        database : 'db'
    })
    
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.set('view engine','ejs')

app.listen(3000,function(){

});
app.use(router)




app.get('/main/guest',function(req,res){
    
        
        
              
    res.sendFile(__dirname+"/aas.html")
});
