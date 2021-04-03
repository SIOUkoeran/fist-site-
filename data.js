const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;
const mysql=require('mysql');
const conn=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '9977',
    database : 'db'
});

conn.connect();
const getHtml = async () => {
  try {
    return await axios.get("https://www1.president.go.kr/petitions/best");
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then(html => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("div.bl_body ul").children("li");

    $bodyList.each(function(i, elem) {
       
      ulList[i] = {
          title: $(this).find('div.bl_subject a').text().replace("제목",""),
          content : $(this).find('div.bl_subject a').text().replace("\n",""),
          comment_side : 1,
         
          writer:  $(this).find('div.bl_agree.cb.wv_agree').text().replace("\t","")
      };
    });
    console.log(ulList)
    let sql ='insert into board set?'
    ulList.forEach(function(inform,index){
        let query = conn.query(sql,[inform],function(err,data){
            if(err)
            console.log(err)
        })
    })
    
    const data = ulList.filter(n => n.title);
    return data;
  
})
  
 