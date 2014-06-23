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

function expectHTTPMethod($method) {
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        http_response_code(405);
        header('Content-Type: text/plain');
        echo "Invalid method {$_SERVER['REQUEST_METHOD']}.";
        exit();
    }
    return;
}

function sendJSONResponse($object) {
    header('Content-Type: application/json');
    echo json_encode($object);
    return;
}
