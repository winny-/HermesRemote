<?php

require_once(__DIR__ . '/hermes.lib.php');

$status = getHermesStatus();

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
