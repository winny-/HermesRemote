<?php

abstract class HermesCommands
{
    const PLAY = 'play';
    const PAUSE = 'pause';
    const PLAYPAUSE = 'playpause';
    const NEXT = 'next song';
    const LIKE = 'thumbs up';
    const DISLIKE = 'thumbs down';
    const TIRED = 'tired of song';
    const INCREASEVOLUME = 'increase volume';
    const DECREASEVOLUME = 'decrease volume';
    const MAXIMIZEVOLUME = 'maximize volume';
    const MUTE = 'mute';
    const UNMUTE = 'unmute';
    const SETPLAYBACKVOLUME = 'set playback volume to REPLACE';
}

function sendHermesCommand($command, $argument=NULL, $script=NULL)
{
    if (is_null($script)) {
        $script = __DIR__ . '/status.applescript';
    }
    if ($command === HermesCommands::SETPLAYBACKVOLUME) {
        $command = str_replace('REPLACE', $argument, $command);
    }

    $statusMessage = null;
    $retval = null;
    exec("osascript {$script} {$command}", $statusMessage, $retval);

    return $retval === 0;
}

function getHermesStatus($script=NULL)
{
    if (is_null($script)) {
        $script = __DIR__ . '/status.applescript';
    }

    $statusMessage = null;
    $retval = null;
    exec("osascript {$script}", $statusMessage, $retval);

    if ($retval !== 0) {
        return false;
    }

    $status = json_decode(implode("\n", $statusMessage), true);

    if ($status['running'] !== true) {
        return false;
    }
    
    return $status['info'];
}

function getHermesRating($rating) {
    switch ($rating) {
        case 0:
            return 'no rating';
        case -1:
            return 'disliked';
        case 1:
            return 'liked';
        default:
            throw new Exception('Bad rating: '.$rating);
    }
}

function formatHermesTime($seconds) {
    $hours = floor($seconds / 3600);
    $mins = floor(($seconds - ($hours*3600)) / 60);
    $secs = floor($seconds % 60);

    $mins = sprintf('%02s', $mins);
    $secs = sprintf('%02s', $secs);

    return "${mins}:{$secs}";
}

?>