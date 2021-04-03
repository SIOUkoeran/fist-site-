const session = require('express-session')
const express =require('express')
const app=express()
const router = express.Router();
app.use(router);
function authenticate(req,res,next){
    if(require.session.is_logined){
        next();
    }
    else 
    {   
        response.redirect('/')
    }
}
module.exports=authenticate();