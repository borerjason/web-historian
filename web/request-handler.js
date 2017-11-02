var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');
var httpHelper = require('./http-helpers.js');
var query = require('query-string');

// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var request = {
    GET: function() {

    },
    POST: function() {
      var data = '';
      req.on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        seachUrl = data.slice(4); 
        console.log(seachUrl);
        // open sites.txt file containing urls
        // archive.isUrlInList(searchUrl, (bool) => {
        //   if (bool) {
        //     archive.isUrlArchived()
        //   }
        // });
      });
      
    }
  };



  var cb = (errorCode) => (err, html) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error!');
    }
    var statusCode = 200;
    var headers = httpHelper.headers;
    res.writeHead(statusCode, headers);
    res.end(html);
  };

  var urlParts = url.parse(req.url);
  var pathname = urlParts.pathname;
  var statusCode = 200;
  if (pathname === '/') {
    httpHelper.serveAssets(res, './web/public/index.html', cb(500));
  } else if (pathname === '/styles.css') {
    httpHelper.serveAssets(res, './web/public/styles.css', (err, css) => {
      if (err) {
        res.writeHead(500);
        res.end();
      }
      var statusCode = 200;
      var headers = httpHelper.headers;
      headers['Content-Type'] = 'text/css';
      res.writeHead(statusCode, headers);
      res.end(css);
    });
  }

  if (request[req.method]) {
    request[req.method]();
  }




  //res.end(archive.paths.list);
};

