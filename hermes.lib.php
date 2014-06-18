<?php

function getHermesStatus($script=NULL)
{
    if (is_null($script)) {
        $script = __DIR__ . '/status.applescript';
    }

    $statusMessage = null;
    $retval = null;
    exec("osascript status.applescript", $statusMessage, $retval);

    $status = array();
    $status['running'] = $statusMessage[0] == '__RUNNING__';
    $status['retval'] = $retval;
    if ($status['running'] === true && $status['retval'] === 0) {
        $status['title'] = $statusMessage[1];
        $status['artist'] = $statusMessage[2];
        $status['album'] = $statusMessage[3];
        $status['artwork'] = $statusMessage[4];
    }

    return $status;
}

?>