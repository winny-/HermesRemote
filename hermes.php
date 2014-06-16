<?php

function getStatus() {
    $statusMessage = null;
    $retval = null;
    exec("osascript status.scpt", $statusMessage, $retval);

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

$status = getStatus();

?>
<!DOCTYPE html>
<body>
    <h1>
        <?php
        if ($status['running'] !== true) {
            echo "Hermes is not running :( &mdash; retval: {$status[retval]}";
        } else {
            echo "Hermes!!!";
        }
        ?>
    </h1>

    <p>
        <?php
        if ($status['running'] === true) {
            echo "{$status['title']}<br>{$status['artist']}<br>{$status['album']}";
            echo '<br>';
            echo "<img src=\"{$status['artwork']}\">";
        }
        ?>
    </p>
</body>
