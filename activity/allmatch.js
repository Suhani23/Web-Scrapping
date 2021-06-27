let request=require("request");
let cheerio=require("cheerio");
let fs=require("fs");
let matchFile=require("./match.js"); //path is provided

let url="https://sports.ndtv.com/ipl-2019/schedules-fixtures";

function allmatchhandler(url)
{
    request(url,cb);
}

function cb(error,header,body)
{
    if(error==null && header.statusCode==200)
    {
        //console.log(body);
        console.log("got the response");
        //fs.writeFileSync("page.html",body);
        parseHTML(body);
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

function parseHTML(body)
{
    let $=cheerio.load(body);

    let allmatch=$(".teams-group-list.vevent .teams-list");
    //console.log(allmatch.length);

    for(let i=0;i<allmatch.length;i++)
    {
        let match=allmatch[i];
        let anchor=$(match).find("a");
        let link=anchor.attr("href");
        //console.log(link);
        matchFile.exp(link);
    }
}
module.exports.exp2=allmatchhandler;