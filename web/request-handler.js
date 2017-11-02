var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');
var httpHelper = require('./http-helpers.js');
var query = require('query-string');

// require more modules/folders here!


exports.handleRequest = function (req, res) {
  
  console.log(req.method);

  var cb = (errorCode) => (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error!');
    }
    var statusCode = 200;
    var headers = httpHelper.headers;
    res.writeHead(statusCode, headers);
    res.end(data);
  };
  
  var urlParts = url.parse(req.url);
  var pathname = urlParts.pathname;
  console.log('pathname: ', pathname);
  // var statusCode = 200;
  
  
  if (req.method === 'GET') {
    if (pathname === '/styles.css') {
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
    if (pathname === '/') {
      httpHelper.serveAssets(res, './web/public/index.html', cb(500));
    }
  }
  
  if (req.method === 'POST') {
    var data = '';
    req.on('data', (chunk) => {
      data += chunk;
    }).on('end', () => {
      console.log(data);
      searchUrl = data.slice(4); 
      archive.isUrlArchived(searchUrl, (bool) => {
        if (bool) {
          httpHelper.serveAssets(res, path.join(archive.paths.archivedSites, '/', searchUrl), cb());
        } else {
          archive.isUrlInList(searchUrl, (exist) => {
            if (!exist) {
              archive.addUrlToList(searchUrl);
            } 
            console.log(cb);
            httpHelper.serveAssets(res, path.join(archive.paths.siteAssets, '/loading.html'), cb());
          });
        }
      });
    });
  }  
};

