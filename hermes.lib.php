<?php

function getHermesStatus($script=NULL)
{
    if (is_null($script)) {
        $script = __DIR__ . '/status.applescript';
    }

    $statusMessage = null;
    $retval = null;
    exec("osascript status.applescript", $statusMessage, $retval);

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

    return "${mins}:{$secs}";
}

?>