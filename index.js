'use strict';

const request = require("node_modules/request");
const cheerio = require("node_modules/cheerio");
var faviconUrl = "";

console.log('Loading lambda function');

function getFaviconUrl(url){
    var urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
    var domain = "https://" + urlParts[0];
    var options = {
        url: domain,
        method: "GET",
        headers: {
            "Accept": "text/html"
        }
    };
    request(options, function (error, response, html){
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            console.log(html);
            $("link", "head", html).each(function(i, element){
                console.log(element);
                const rel = $(element).attr("rel");
                if (rel === "icon" || rel === "shortcut icon" || rel === "fluid-icon") {
                  faviconUrl = $(element).attr("href");
                  return false;
                }
            });
            if (faviconUrl.indexOf("/") === 0) { // If path returned is relative
                faviconUrl = "https://" + domain + faviconUrl;
            }
        }
    });
}

exports.handler = (event, context, callback) => {
    getFaviconUrl(event.url);
    callback(null, faviconUrl)
}