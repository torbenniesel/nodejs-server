const fs = require('fs');
const path = require('path');
const http2 = require('http2');
const mime = require('mime');

 

//const {myLog} = require('./functions');
const { PerformanceObserver } = require('perf_hooks');



const { HTTP2_HEADER_PATH } = http2.constants;
const PORT = process.env.PORT | 443;

const options = {
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt'),
    ca: fs.readFileSync('ssl/server-ca.crt'),
    allowHTTP1: true,
};

// Create a secure HTTP/2 server
const server = http2.createSecureServer(options, onRequest);

let now = 0;
// Listen to Port X 
server.listen(PORT, function(){
    now = new Date().getTime();
    console.log("Server started on Port "+PORT);
});

// Request handler
function onRequest(req,res) {
    let path = req.headers[":path"];
    console.log("Stream "+req.stream.id, ":path = "+path);
    
    
    if(path.includes("favicon.ico")){
        res.stream.respondWithFile('favicon.ico');
    }
    else if(path === "/"){
        
        let fileToPushPath = "/public/js/jquery.js";

        res.stream.pushStream({ [HTTP2_HEADER_PATH]: fileToPushPath }, (err, pushStream) => {
            //Check for Errors
            if(err || !pushStream){
                console.log("Pushstream Error: ", !pushStream ? "PushStream is null" : err);
                return;
                
            }
            //Set Priority
            
            //send File
            myRespondWithFD(fileToPushPath,pushStream);
            pushStream.end();
        });
        
        myRespondWithFD("/public/index.html", req.stream);
        res.end(null);
    }
    else if(path === "/getproductinfos" || path === "/getproductinfos/"){
        
        // request("https://www.amazon.de/gp/product/B071WKJX72/", function(error, response, html){
        //     if(!error){
        //         var $ = cheerio.load(html);
        //         var test = $("#imgTagWrapperId");
        //         var test2 = test.attr("src");
        //         var scriptSrc = $("#imageBlock_feature_div > script").html()
        //         var dataString = scriptSrc.substring(scriptSrc.indexOf("var data"), scriptSrc.indexOf("};")+2);
        //         var data = eval(dataString);
        //         console.log(data);
        //         console.log("test");
        //     }
        // });

    }
    else{
        myRespondWithFD(path,res.stream);
        res.end(null);
    }
}

// ON Stream startet
server.on("stream", function(stream){
    //Stream started (after request received)
    stream.on("close", function(){
        //Stream Closed
    });
});

//Send File to Client > path = "/public/../filename.js"
function myRespondWithFD(path, stream){
    let filePath = '.'+path;
    let fd = fs.openSync(filePath, 'r');
    let stat = fs.fstatSync(fd);
    let headers = {
        'content-length': stat.size,
        'last-modified': stat.mtime.toUTCString(),
        'content-type': mime.getType(filePath)
    }
    stream.respondWithFD(fd, headers);
}

//Push sth to Client > not implementd
function myPush(){
    //Code here
}

//Get TLS Socket for IP of Client or sth like that > stream.session, socket -> Returns TLS Socket
function getSymbol(object, symbolName){
    var objKeyArray = Reflect.ownKeys(object);
    var symbolObj;
    for(i in objKeyArray){
        if(objKeyArray[i].toString() == "Symbol("+symbolName+")"){
            symbolObj = Reflect.get(object,objKeyArray[i]);
            return symbolObj;
        }
    }
    return undefined;
}

