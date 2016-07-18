var cheerio = require('cheerio');
var fs = require('fs');

var settings = require('./settings.json');

console.log('settings', settings);

var acc = settings.auth.user;
var pwd = settings.auth.pass;

var data = 'Summary | Issue Type | Component | Issue Id | Parent Id | Description | Epic Link | Labels | Epic Name \n';
var issueId  = 0;
var parse = function(url){


   return function(source){

    issueId++;

    var $ = cheerio.load(source.value);
    var epicName= $('#title-text').text().trim() + " Epic";
    console.log("epicName", epicName);
    console.log("issueId", issueId);

    data = data + epicName + '| Epic | | '+ issueId + '| | | | |'+ epicName + '\n';

    var storySummary =  $('#main h1').find('a').text();
    $('.jira-issue').remove();

    $('#main #content h3').each(function(){
      var label = $(this).text().trim();

      issueId++;
      var storyId = issueId;
      var subTasksId = [];

      var lis =  $(this).next('ol').find('li');
      lis.each(function(){

         issueId++;
         var subTaskId = issueId;
         subTasksId.push(subTaskId);

         var $this = $(this)
         $this.find("ol").remove();
         var subSummary = $this.text().trim();

          data = data + subSummary + '| Sub-task  | ' + label + '| '+ subTaskId + ' | '+ storyId + '| | | ' + label+ '\n';
      });


        data = data + storySummary + ' - ' + label + ' | Story |' + label + ' | '+ storyId + ' | | Please refer to: ' +  url +  ' | ' + epicName +'| ' + label + '\n';

    });


    fs.appendFile('./issues.csv', data, function (err) {
      // console.err("errror", err);
    });


  
    return;
  
}
}


var test = {};


var generate = function(url, data, issueId){


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
        .source(parse(url))
        .end();
 }
}


// test["article"] = generate('https://gextech.atlassian.net/wiki/display/REMT/Article');
// test["imageGallery"] = generate('https://gextech.atlassian.net/wiki/display/REMT/Image+Gallery');
test['linkedArticle'] = generate('https://gextech.atlassian.net/wiki/display/GLOB/Global+Linked+Article', data);
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
