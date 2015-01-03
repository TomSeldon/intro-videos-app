# Random Video Intro for Plex

**Meant for personal use only, hence the lackluster documentation.**

## Purpose:
Serve a random video file over HTTP to use with *Plex Cinematic Trailers*. Allows you to populate a folder (location
configurable via env var) with intro videos which will be accessible over HTTP. When visiting the exposed URL, a random
file from the configured directory will be served.

The URL can be used within the Plex settings as the URL to use for custom cinematic intro.

## Usage:
Set env var `INTRO_VIDEO_DIR` to the directory where your video files are located. Note that this doesn't do anything
clever with regards to the files in that folder. It's up to you to make sure everything in that folder is a valid video
file (no support for sub-folders).

`npm start` or ideally use with `forever`.

Server will run on `http://localhost:3000` (or whatever port you've configured; see below).

## Config:
`INTRO_VIDEO_DIR` - *required* - Directory where intro videos are located.
`INTRO_VIDEO_PORT` - *default: 3000* - Port that the application will run on.
