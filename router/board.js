const express = require('express');
const app=express()
const router = express.Router();
const path=require('path')
const mysql=require('mysql');
const fs=require('fs');
const ejs = require('ejs');
var bodyParser = require('body-parser');

function authenticate(req,res){
    if(req.session.is_logined==true){
        
    }
    else 
    {   
        response.redirect('/')
    }
}

const conn=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '9977',
    database : 'db'
});
conn.connect();

router.use(bodyParser.urlencoded({ extended: false }))


router.get('/list',function(req,res){
    res.redirect('/board/page/'+1);
})
router.get('/page/:cur',function(req,res){
    authenticate(req,res);
    
    let page_size = 10;
    let page_list_size = 5; 
    let limit1='';
    let sql='select count(*) as cnt from board';
    
    let query=conn.query(sql,function(err2,data){
       
    let total_post = data[0].cnt;
    console.log('총 게시물 개수',total_post);
    let page = req.params.cur;
    console.log('현재 페이지',page);
    if(total_post<0){
        total_post == 0;
    }
    let total_page = Math.ceil(total_post/page_size);
    console.log('총 페이지 개수',total_page);
    
    let total_set = Math.ceil(total_page/page_list_size);
    let cur_set = Math.ceil(page/page_list_size);
    let start = ((cur_set-1)*5)+1;
    console.log('현재 세트',cur_set)
    console.log('start',start)
    let end = (start + page_list_size) - 1;


    console.log('end',end)
    if(page<0){
        limit1=0;
    }   else{
        limit1 = (page-1)*10;
    }
    let page_inform={
        "page" : page,
        "page_list_size" : page_list_size,
        "page_size" : page_size,
        "total_page" : total_page,
        "total_set" : total_set,
        "cur_set" : cur_set,
        "start" : start, 
        "end" : end
    };
    let filepath= path.join(__dirname,'../board/aas.html')
    fs.readFile(filepath,'utf-8',function(err,data){
        if (err) {
            console.log("ejs오류" + err);
            return
            }
            
            
            
        let sql1 = 'select * from board order by baord_date desc limit ?,? ';

        let query = conn.query(sql1, [limit1, page_size],function(err,result){
            if(err){
                console.log(err)
            }
            console.log(result)
            res.send(ejs.render(data,{
                data : result,
                pasing : page_inform
            }));
        });
    });

})
});
   



router.get('/write',function(req,res){
    authenticate(req,res);
    console.log(req.session.name);
    res.sendFile(path.join(__dirname+'/../board/write.html'))
});

router.post('/write/send',function(req,res){
    authenticate(req,res);
   let inform=
   {
    title : req.body.title,
    content : req.body.content,
    comment_side : '1',
    writer : req.session.name
   }

   console.log(inform)
    let sql='insert into board set ?';
    var query = conn.query(sql,inform,function(err,result){
        
        if(err)
        {
            throw err;
        }
        else if(!err){
            res.redirect('/board/list')
        }
    });
   



});
router.get("/post/:id", function (req, res) {
    
    let board_num = req.params.id;
    
    let filepath = path.join(__dirname,'../board/post.html');
    fs.readFile(filepath,'utf-8',function(err,data){
    let sql = 'select * from board where board_num=?'
    let sql1 = 'update board set hits=hits +1 where board_num=?'
    let query=conn.query(sql,[board_num],function(err,result){
        console.log(result)    
            let query = conn.query(sql1,[board_num],function(err,result){
                
            })
        if(err){
            console.log('에러',err)
        }
   
        else 
            {   let sql1='select * from comment where num=?'
                let sql2='select count(*) as cnt from comment where num=?'
            
            let query1 = conn.query(sql1,[board_num],function(err,result1){
                
                let query2= conn.query(sql2,[board_num],function(err,result2){
                    
                    let comment_cnt = result2[0];

                    
                   
       
                let ok ={"update" : true};
                res.send(ejs.render(data,{
                    //comment : result1,
                    data : result,
                    ida : ok,
                    comment : result1,
                    comment_cnt : comment_cnt
                }));
            })   
            })
            }
    
      
            
        
    });
});
  
})
router.post('/comment/:id',function(req,res){
    authenticate(req,res);
   let num =req.params.id;
    
   let inform=
   {

    num : num,
    comment_writer : req.session.name,
    comment_content : req.body.comment

   }
   
    let sql='insert into comment set?'
    var query=conn.query(sql,inform,function(err,result){
        
        res.redirect('/board/post/'+num)

    })
    
   

    
});
    
    
    
    
module.exports=router;