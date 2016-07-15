var cheerio = require("cheerio");
var fs = require("fs");

var settings = require("./settings.json");

console.log("settings", settings);

var acc = settings.auth.user;
var pwd = settings.auth.pass;

var parse = function(source){

    var $ = cheerio.load(source.value);
    var component =  $("#main h1").find("a").text();
    $(".jira-issue").remove();
    $("#main #content h3").each(function(){
      var story = $(this).text().trim();

      data = data + story + "|| Story |" + component + "\n";

      var lis =  $(this).next("ol").find("li");
      lis.each(function(){

         var $this = $(this)
         var sublist  = $this.find("ol").html();
         $this.find("ol").remove()
      
         data = data + story + "| " + $this.text().trim() + "| Task | " + component + "\n";
      });

    });


    fs.appendFile('./issues.csv', data, function (err) {
      // console.err("errror", err);
    });


  
    return;
  
}


var test = {};


var generate = function(url, data){


 return function (browser){
   return  browser
        .url(settings.urlLogin)
        .setValue('#username', acc)
        .setValue('#password', pwd)
        .waitForElementVisible('#login', 1000)
        .click('#login')
        .pause(2000)
        .url(url)
        .waitForElementVisible('body', 1000)
        .source(parse)
        .end();
 }
}

var data = "Story| Summary| Issue Type | Component\n"
// test["article"] = generate('https://gextech.atlassian.net/wiki/display/REMT/Article');
// test["imageGallery"] = generate('https://gextech.atlassian.net/wiki/display/REMT/Image+Gallery');
test["linkedArticle"] = generate('https://gextech.atlassian.net/wiki/display/GLOB/Global+Linked+Article', data);
// test["video"] = generate('https://gextech.atlassian.net/wiki/display/REMT/Video');
// test["homepage"] = generate('htgextech.atlassian.net/wiki/display/REMT/Homepage');
// test["infografia"] = generate('https://gextech.atlassian.net/wiki/pages/viewpage.action?pageId=51380311');
// test["search"] = generate('https://gextech.atlassian.net/wiki/display/REMT/Search');
// test["section"] = generate('https://gextech.atlassian.net/wiki/display/REMT/Section+Page');
// test["tag"] = generate('https://gextech.atlassian.net/wiki/display/REMT/Tag+Page');
// test["newsletter"] = generate('https://gextech.atlassian.net/wiki/display/REXP/Subscriptions+Page');
// test["errorPage"] = generate('https://gextech.atlassian.net/wiki/display/REMT/Error+Page');
// test["staticPages"] = generate('https://gextech.atlassian.net/wiki/display/REMT/Static+Pages');



module.exports = test;
