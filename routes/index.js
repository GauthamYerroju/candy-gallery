var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var async = require('async');

var videoExtensions = ['.mp4', '.webm'];

/* GET home page. */
router.get('/', function(req, res, next) {
  var renderVars = {
    title: 'Gallery: ' + req.basePath,
    basePath: req.basePath,
    relPathList: [],
    relPath: '',
    items: [],
    error: null
  };
  var relPathList = [];
  if (req.query.path) {
    relPathList = req.query.path.replace(/^\/|\/$/g, '').split(path.sep);
    renderVars.relPathList = relPathList;
    renderVars.relPath = relPathList.join(path.sep);
  }
  var absPath = path.join(req.basePath, relPathList.join(path.sep));

  var isFolder = fs.statSync(absPath).isDirectory();
  if (isFolder === false) {
    res.render('index', renderVars);
    return true;
  }

  fs.readdir(absPath, function(err, files) {
    if (err) {
      renderVars.error = err;
      res.render('index', renderVars);
      return false;
    }
    async.map(files, function(file, callback) {
      var absFilePath = path.join(absPath, file);
      var item = {};
      item.name = file;
      item.isFolder = fs.statSync(absFilePath).isDirectory();
      if (item.isFolder) {
        // TODO: Get relPathList of first image in folder
      }
      item.isVideo = ( videoExtensions.indexOf( path.extname(file) ) >= 0 );
      callback(null, item);
    }, function(err, itemObjects) {
      if (err) {
        renderVars.error = err;
        res.render('index', renderVars);
      } else {
        renderVars.items = itemObjects;
        res.render('index', renderVars);
      }
    });
  });
});

// Get file
router.get('/file', function(req, res, next) {
  var absPath = req.basePath;
  if (req.query.path) {
    absPath = path.join(absPath, req.query.path);
  }
  // TODO: Check if file exists, return 404 or other error if not readable
  fs.stat(absPath, function(err, stats) {
    if (err) {
      res.status(503).send(err);
      return false;
    }
    if (stats.isFile() !== true) {
      res.status(503).send(absPath + " is not a file.");
      return false;
    }
    res.sendFile(absPath);
    return true;
  }); 
});

module.exports = router;
