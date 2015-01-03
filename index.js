'use strict';

var DEFAULT_PORT = 3000;
var DEFAULT_ALLOWED_FILE_EXTS = ['.m4v'];
var DEFAULT_IGNORE_DOT_FILES = true;

var fs = require('fs');
var path = require('path');
var winston = require('winston');
var morgan = require('morgan');
var promisify = require('./lib/promisify');
var readdir = promisify(fs.readdir);
var express = require('express');
var app = express();
var videoDir = process.env.INTRO_VIDEO_DIR;
var port = process.env.INTRO_VIDEO_PORT || DEFAULT_PORT;
var allowedFileExtensions = process.env.INTRO_VIDEO_ALLOWED_EXTS || DEFAULT_ALLOWED_FILE_EXTS;
var ignoreDotFiles = process.env.INTRO_VIDEO_IGNORE_DOT_DILES || DEFAULT_IGNORE_DOT_FILES;
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'debug',
            filename: './logs/info.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),

        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],

    exitOnError: false
});

if (!videoDir) {
    logger.error('No video directory specified. Set the env var `INTRO_VIDEO_DIR` to where your videos are located.');
    process.exit(1);
}

if (typeof allowedFileExtensions === 'string') {
    allowedFileExtensions = allowedFileExtensions.split(',');
}

app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', function(req, res) {
    getRandomIntroVideo()
        .then(function(video) {
            logger.debug('Responding with: ' + video);

            res.sendFile(video);
        });
});

app.listen(port, function() {
    logger.debug('Serving random videos...');
});

function getRandomIntroVideo() {
    return getAvailableVideos()
        .then(getRandomVideo);
}

function getAvailableVideos() {
    return readdir(videoDir)
        .then(function(files) {
            return files.filter(function(file) {
                var ext = path.extname(file);
                var basename = path.basename(file);
                var isValid = allowedFileExtensions.indexOf(ext) !== -1;
                var isDotFile = basename.indexOf('.') === 0;

                return isValid && (ignoreDotFiles && !isDotFile || !ignoreDotFiles);
            });
        });
}

function getRandomVideo(videos) {
    var index = Math.floor(Math.random() * videos.length);
    var video = videos[index];
    var absPath = path.resolve(videoDir, video);

    logger.debug('Selecting a random video from: ' + videos);
    logger.debug('Chosen video: ' + absPath);

    return path.resolve(absPath);
}

module.exports = app;
