# HermesRemote

This project is under flux and flow. Subject to change and breakage. Enjoy!

## What is it?

![Screenshot of HermesRemote](http://i.imgur.com/VDXWaPI.png)

The marriage of AppleScript and an dynamic webpage.
An experiment: Control Hermes without adding server code to the main project.
Success! One may control Hermes from a webpage.

There [was an attempt to create a remote control](https://github.com/HermesApp/Hermes/pull/75) for Hermes.
Another user [asked about a similar solution](https://github.com/HermesApp/Hermes/issues/100).

PHP is great. It's shipped with all Macs. With a few clicks, a PHP-enabled webserver is running on your Mac.

## What can it do?

- View current song information including album art
- Like or Dislike a song
- Play/Pause and Next song

## How to use?

Two options:
- [Set up the built-in PHP and webserver](http://apple.stackexchange.com/a/23757)

or
- Install `php55` from Homebrew: `brew install php55`
- Run this from the project directory: `/usr/local/bin/php -S localhost:1234`
- Open [http://localhost:1234/](http://localhost:1234/) in your browser.


## What needs to be added to Hermes

- `stations` does not know the `count` message, so one cannot iterate over stations.
- Expose song history to AppleScript.

## Limitations of HermesRemote

- Is vulnerable to AS injection because `sendHermesCommand()` does not validate commands.
- Cannot switch stations.
- Cannot view a list of recent songs.
- `api.php` is send a `GET` every second — per client! Needs caching.
