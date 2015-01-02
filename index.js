'use strict';

var DEFAULT_PORT = 3000;

var fs = require('fs');
var path = require('path');
var promisify = require('./lib/promisify');
var readdir = promisify(fs.readdir);
var express = require('express');
var app = express();
var videoDir = process.env.INTRO_VIDEO_DIR;
var port = process.env.INTRO_VIDEO_PORT || DEFAULT_PORT;
var logger = log;

if (!videoDir) {
    console.error('No video directory specified. Set the env var `INTRO_VIDEO_DIR` to where your videos are located.');
    process.exit(1);
}

app.route('/')
    .get(function(req, res) {
        getIntroVideos()
            .then(getRandomVideo)
            .then(function(video) {
                logger('Responding with: ' + video);

                res.sendFile(video);
            });
    });

app.listen(port, function() {
    logger('Serving random videos...');
});

function getIntroVideos() {
    return readdir(videoDir);
}

function getRandomVideo(videos) {
    var index = Math.floor(Math.random() * videos.length);
    var video = videos[index];
    var absPath = path.resolve(videoDir, video);

    logger('Selecting a random video from: ' + videos);
    logger('Chosen video: ' + absPath);

    return path.resolve(absPath);
}

function log(message) {
    console.log(message);
}

module.exports = app;
