let request=require("request");
let cheerio=require("cheerio");
let fs=require("fs");

let allmatchFile=require("./allmatch.js"); //path is provided

let url="https://sports.ndtv.com/ipl-2019";

request(url,cb);

function cb(error,header,body)
{
    if(error==null && header.statusCode==200)
    {
        //console.log(body);
        console.log("got the response");
        //fs.writeFileSync("page.html",body);
        parseHtml(body);
    }
    else if(header.statuscode==404)
    {
        console.log("page not found");
    }
    else
    {
        console.log(header);
        console.log(error);
    }
}

function parseHtml(body)
{
    let $=cheerio.load(body);
    let alllinks=$(".sub-nv_li a");
    let mainlink=$(alllinks[4]).attr("href");
    mainlink="https://sports.ndtv.com/"+mainlink;
    //console.log(mainlink);
    allmatchFile.exp2(mainlink);
}

