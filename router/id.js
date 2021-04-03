const express = require('express');
const path=require('path')
const mysql=require('mysql');
const bodyParser=require('body-parser')
const router = express.Router();
const session = require('express-session')
const MySQLStore=require('express-mysql-session')(session);
var board=require('./board');
const app=express();



var conn=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '9977',
    database : 'db'
});
conn.connect();

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));



router.get('/signUp/form',function(req,res){
    res.sendFile(path.join(__dirname+'/../login/signUp.html'))
})
router.post('/signUp',function(req,res){
    var inform=
    {    
     'id' : req.body.signUp_id, 
     'name'  : req.body.signUp_name,
     'pwd' : req.body.signUp_pwd
    }  
    
    var sql = 'INSERT INTO login set ?';
    
    var query=conn.query(sql,inform,function(err, rows, fields) { 
      if(!err){
         res.redirect('/')
          
      }
      
      else if(err){
          
          res.redirect('/signUp')
      } 
      
    });
    
    });
    router.post('/login',(req,res)=>{
        
            
        let id =  req.body.login_id;
        let pwd = req.body.login_pwd;

        let sql="select * from login where id=? pwd=?";
        
        let query=conn.query('SELECT id, pwd FROM login WHERE id = "' +id+'" AND pwd = "' +pwd+'" ',function(err,result){
            if (result[0]==undefined){
                res.redirect('/');
            }
           else if(result[0]!=undefined) {
                    var user=result[0];
                    req.session.name=user.id;
                    
                    req.session.is_logined = true;
                    res.redirect('/board/list')               
                }
            })

        
    });

    router.use('/board',board)
    module.exports=router;