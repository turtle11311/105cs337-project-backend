'use strict';

const fs = require('fs-extra');
const path = require('path');

let folderTraveler = (dir) => {
  let result = new Object();
  let files = fs.readdirSync(dir);
  for (let file of files) {
    if (file == '.git') continue;
    let fullpath = path.join(dir, file);
    if (fs.statSync(fullpath).isDirectory()) {
      result[file] = folderTraveler(fullpath);
    } else {
      result[file] = file;
    }
  }
  return result;
};

module.exports = folderTraveler;
