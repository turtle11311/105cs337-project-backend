'use strict';

const fs = require('fs-extra');
const path = require('path');

let folderTraveler = (dir) => {
  let result = new Array();
  let files = fs.readdirSync(dir);
  for (let file of files) {
    if (file == '.git') continue;
    let fullpath = path.join(dir, file);
    if (fs.statSync(fullpath).isDirectory()) {
      result.push({
        title: file, key: file, folder: true, children: folderTraveler(fullpath)
      });
    } else {
      result.push({ title: file, key: file});
    }
  }
  return result;
};

module.exports = folderTraveler;
