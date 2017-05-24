'use strict';

var http = require('http');
var url = require('url');

function onRequest(request,response) {
    console.log("Request received.");
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write("<html><body><h2>Hello, world!</h2></body></html>");
    response.end();
}

http.createServer(onRequest).listen(8888);

console.log("Server has started.");