/*
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const temp = require('temp');

function createTempFileWith(content, filename) {
  const info = temp.openSync();
  let filePath = info.path;
  fs.writeSync(info.fd, content);
  fs.closeSync(info.fd);

  if (filename) {
    var directory = temp.mkdirSync();
    var newPath = directory + '/' + filename;
    fs.renameSync(filePath, newPath);
    filePath = newPath;
  }
  return filePath;
}
exports.createTempFileWith = createTempFileWith;

function createTransformWith(content, fileName) {
  return createTempFileWith(
    'module.exports = function(fileInfo, api, options) { ' + content + ' }',
    fileName
  );
}
exports.createTransformWith = createTransformWith;

function getFileContent(filePath) {
  return fs.readFileSync(filePath).toString();
}
exports.getFileContent = getFileContent;
