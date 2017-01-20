var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Get folder contents. */
router.get('/folder', function(req, res, next) {
  var absPath = path.join(req.basePath, req.query.path);
  fs.readdir(absPath, function(err, files) {
    if (err) {
      res.status(503).send(err);
      return false;
    }
    async.map(files, function(file, callback) {
      var absFilePath = path.join(absPath, file);
      var item = {};
      item.name = file;
      item.relPath = path.join(req.query.path, file);
      item.isFolder = fs.statSync(absFilePath).isDirectory();
      if (item.isFolder) {
        // TODO: Get relPath of first image in folder
      }
      callback(null, item);
    }, function(err, itemObjects) {
      if (err) {
        res.status(503).send("Error when reading directory contents: " + err);
      } else {
        res.send(itemObjects);
      }
    });
  });
});

// Get file
router.get('/file', function(req, res, next) {
  var absPath = path.join(req.basePath + req.query.path);
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
