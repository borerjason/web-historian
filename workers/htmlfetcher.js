// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');

var fetch = function () {
  archive.readListOfUrls((list) => {
    let urls = [];
    for (let site of list) {
      archive.isUrlArchived(site, (bool) => {
        if (!bool) {
          urls.push(site);
        }
        if (site === list[list.length - 1]) {
          archive.downloadUrls(urls);
        }
      });
    }
  });
};
fetch();
