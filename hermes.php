<?php

require_once(__DIR__ . '/hermes.lib.php');

$status = getHermesStatus();

?>
<!DOCTYPE html>
<body>
    <h1>
        <?php
        if (!$status) {
            echo "Hermes is not running :(";
        } else {
            echo "Hermes: {$status['state']}";
        }
        ?>
    </h1>

    <p>
        <?php
        if ($status) {
            echo "{$status['title']}<br>{$status['artist']}<br>{$status['album']}";
            echo '<br><br>';
            $position = formatHermesTime($status['position']);
            $duration = formatHermesTime($status['duration']);
            echo "{$status['rating']} :: {$position}/{$duration}";
            echo '<br>';
            echo "<img src=\"{$status['artwork']}\">";
        }
        ?>
    </p>
</body>
