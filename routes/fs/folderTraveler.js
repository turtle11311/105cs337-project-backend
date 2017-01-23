'use strict';

const fs = require('fs-extra');
const path = require('path');

let folderTraveler = (repopath, dir) => {
  let result = new Array();
  let files = fs.readdirSync(path.join(repopath, dir));
  for (let file of files) {
    if (file == '.git') continue;
    let fpath = path.join(dir, file);
    if (fs.statSync(path.join(repopath, fpath)).isDirectory()) {
      result.push({
        title: file, key: fpath, folder: true, children: folderTraveler(repopath, fpath)
      });
    } else {
      result.push({ title: file, key: fpath});
    }
  }
  return result;
};

module.exports = folderTraveler;
