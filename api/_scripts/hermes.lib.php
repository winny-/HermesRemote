<?php

$hermesCommands = array(
    'play',
    'pause',
    'playpause',
    'next song',
    'thumbs up',
    'thumbs down',
    'tired of song',
    'increase volume',
    'decrease volume',
    'maximize volume',
    'mute',
    'unmute',
    'set playback volume to ',
);

// XXX: Validate commands to prevent AS injection.
function sendHermesCommand($command, $argument=NULL, $script=NULL)
{
    if (is_null($script)) {
        $script = __DIR__ . '/status.applescript';
    }
    if (!in_array($command, $GLOBALS['hermesCommands'])) {
        error_log("Command \"{$command}\" not in \$hermesCommands.");
        return false;
    }

    if (!is_null($argument)) {
        if ($command === 'set playback volume to ' && is_numeric($argument) && count($argument) < 3) {
            $command .= $argument;
        } else {
            error_log("Invalid argument \"{$argument}\" for command \"{$command}\".");
            return false;
        }
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
        trigger_error("Return value: {$retval}");
        return false;
    }

    $status = json_decode(implode("\n", $statusMessage), true);

    if ($status['running'] !== true) {
        trigger_error("Not running: {$status['running']}");
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