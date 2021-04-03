var http=require('http');
var fs = require('fs');
var url=require('url');
var qs=require('querystring');

function templateHTML(title, list,body,control){
  return `<!doctype html>
  <html>
  <head>
    <title>agora- ${title}</title>
    <meta charset="utf-8">
    <style>
    ul{
      list-style:none;
    }
    .delete_button{
      border : solid 1px;
    }
    textarea{
      resize:none;
      width:50%; 
      height : 400px;
    }
    </style>
  </head>
  <body>
    <h1><a href="/">agora</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `}
function templateList(filelist){
  var list='<ul>';
                var i=0;
                while(i<filelist.length){
                    list=list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i=i+1;

                }
            list =list+'</ul>';
  return list;
}

var app=http.createServer(function(request,response)
{
    var _url=request.url;
    var queryData=url.parse(_url,true).query;
    var pathname=url.parse(_url,true).pathname;

    if(pathname === '/'){
        if(queryData.id===undefined){
            fs.readdir('./data',function(error,filelist){
                var title='me';
                var description='Hello, Node.js';
            var list=templateList(filelist);    
            var template = templateHTML(title, list,`<h2>${title}</h2>${description}`,`<a href = "/create>create</a>`);
            response.writeHead(200);
            response.end(template);

            });
        }
    else{
            fs.readdir('./data',function(error, filelist){
              fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
                var title=queryData.id;
                
                var list=templateList(filelist);
                var template = templateHTML(title, list,
                  `<h2>${title}</h2>${description}`,
                `<button type = "button" onclick="location.href='/create'">create</button>
                <button type = "button" onclick = "location.href= '/update?id=${title}'">update</button>
                <form action ="delete_process" method="post" onsubmit="real?">
                  <input type="hidden" name="id" value="${title}">
                  <input type = "submit" value="delete" id = "delete_button">
                </form>`);
              response.writeHead(200);
              response.end(template);
                
            });
        });
      }
        
    }else if(pathname ==='/create'){
          fs.readdir('./data',function(error,filelist){
            var title='Web-create';
            var list=templateList(filelist);
            var template = templateHTML(title, list,`
            
            </style>
            <form action="http://localhost:3000/create_process" method="post">
            <p><input type="text" name= "title" placegolder="title"></p>
            <p>
            <textarea name="description" placegolder="description"></textarea>
            </p>
            <p>
            <input type = "submit">
            </p>
            </form>
            `, '');
            response.writeHead(200);
            response.end(template);
        });
      }else if(pathname==='/create_process'){
        var body='';
        request.on('data',function(data){
            body=body+data;
            
        });
        request.on('end',function(){
          var post= qs.parse(body);
          var title=post.title;
          var description=post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location : `/?id=${title}`});
            response.end('sucess');
          });
        });
     
        
        
        
      }
      else if(pathname==='/update'){
        fs.readdir('./data',function(error, filelist){
          fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
            var title=queryData.id;
            
            var list=templateList(filelist);
            var template = templateHTML(title, list,`           
             <form action="http://localhost:3000/update_process" method="post">
             <input type="hidden" name="id" value="${title}">
            <p><input type="text" name= "title" placegolder="title" value="${title}"></p>
            <p>
            <textarea name="description" placegolder="description" >${description}</textarea>
            </p>
            <p>
            <input type = "submit">
            </p>
            </form>
            `,`<a href = "/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(template);
            
        });
    });
      }
      else if(pathname==='/update_process'){
        var body='';
        request.on('data',function(data){
            body=body+data;
            
        });
        request.on('end',function(){
          var post= qs.parse(body);
          var title=post.title;
          var id=post.id;
          var description=post.description;
          console.log(post);
          fs.rename(`data/${id}`,`data/${title}`,function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location : `/?id=${title}`});
              response.end('sucess');
            });
          });
          
        });
       
      }
      else if(pathname==='/delete_process'){
        var body='';
        request.on('data',function(data){
          body=body+data;
        })
        request.on('end',function(data){
          var post=qs.parse(body);
          var id=post.id;
          
            fs.unlink(`data/${id}`,function(err){
              response.writeHead(302,{Location:'/'});
              response.end();
            });
            
          });
        }
      
      else{
            response.writeHead(404);
            response.end('Not found');
    }
});
app.listen(3000);