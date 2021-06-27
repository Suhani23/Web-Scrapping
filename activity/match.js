let request=require("request");
let cheerio=require("cheerio");
let fs=require("fs");
let xlsx=require("xlsx");
let path=require("path");

let url="https://sports.ndtv.com/cricket/live-scorecard/chennai-super-kings-vs-royal-challengers-bangalore-match-1-chennai-ckbc03232019189310";

function matchHandler(url)
{
    request(url,cb);
}

function cb(error,header,body)
{
    if(error==null && header.statusCode==200)
    {
        //console.log(body);
        console.log("got the response");
        fs.writeFileSync("page.html",body);
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
    let $ = cheerio.load(body);
    let res=$(".scr_ftr-txt.matchresult");
    //console.log(res.text());

    let bothInnings=$(".ful_scr-crd .swiper-container.scr_crd_tbA .ful_scr-ul.swiper-wrapper .swiper-slide.ful_scr-li");
    let temp=$(".ful_scr-crd .swiper-container.scr_crd_tbB .swiper-wrapper#inng-slds-scr-dtl .swiper-slide .ful_scr-cnt .ful_scr-tbl");
    console.log(temp.length);

    let k=0;
    for(let i=0;i<temp.length;i++) //0,3-> batsman 1,4->extra 2,5->bowler 
    {
        if(i==0 || i==3)
        {
            (i==0)?k=0:k=1; //k moves on both innings
            (i==0)?l=1:l=0;

            let teamNameEle=$(bothInnings[k]);
            let teamName=teamNameEle.text().split(" ");
            teamName=teamName[0].trim();
            console.log(teamName);
            let Opponent=$(bothInnings[l]);
            let OpponentName=Opponent.text().split(" ");
            OpponentName=OpponentName[0].trim();
            console.log(OpponentName);

            let allRows=$(temp[i]).find("tr");
            //let allRows=$0;
            //console.log(allRows.length);

            for(let j=0;j<allRows.length;j++)
            {
                let allcols=$(allRows[j]).find("td");
                
                if(allcols.length>4)
                {
                    let pName = $(allcols[0]).text().split("*")[0].trim();
                    let runs = $(allcols[1]).text().trim();
                    let balls = $(allcols[2]).text().trim();
                    let fours = $(allcols[3]).text().trim();
                    let sixes = $(allcols[4]).text().trim();
                    let sr = $(allcols[5]).text().trim();
                    //console.log(pName);
                    //console.log(teamName +" " + pName +" " + runs +" " + balls +" " + sixes +" " + fours +" " + sr);
                    processPlayer(teamName,OpponentName,pName,runs,balls,fours,sixes,sr)
                }
            }
        }
    }  
}

function excelReader(filePath, name) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    // workbook 
    let wt = xlsx.readFile(filePath);
    let excelData = wt.Sheets[name];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

function excelWriter(filePath, json, name) {
    // console.log(xlsx.readFile(filePath));
    var newWB = xlsx.utils.book_new();
    // console.log(json);
    var newWS = xlsx.utils.json_to_sheet(json)
    xlsx.utils.book_append_sheet(newWB, newWS, name)//workbook name as param
    xlsx.writeFile(newWB, filePath);
}

function processPlayer(team,oppo,pname,runs,balls,fours,sixes,sr)
{
    let obj={
        team,oppo,runs,balls,fours,sixes,sr
    };

    let teamPath = team;
    if(!fs.existsSync(teamPath))
    {
        fs.mkdirSync(teamPath);
    }

    let playerfile=path.join(teamPath,pname) + '.xlsx';

    let fileData=excelReader(playerfile,pname);

    let json=fileData;
    if(fileData == null)
    {
        json=[];
    }

    json.push(obj);
    excelWriter(playerfile,json,pname);
    
}

module.exports.exp=matchHandler;