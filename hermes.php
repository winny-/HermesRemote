<?php

require_once(__DIR__ . '/hermes.lib.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    sendHermesCommand($_POST['command']);
    return;
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $status = getHermesStatus();
    if (array_key_exists('json', $_GET)) {
        header('Content-Type: application/json');
        echo json_encode($status);
        return;
    }
} else {
    http_response_code(500);
    return;
}

$overview = $status ? "Hermes: {$status['state']}" : 'Hermes is not running :(';

?>
<!DOCTYPE html>
<head>
    <title><?php echo $overview; ?></title>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.js"></script>
    <script src="hermes.app.js"></script>
</head>
<body>
    <h1><?php echo $overview; ?></h1>

    <ul>
        <li><input type='button' id='playpause' value='Play/Pause'></li>
        <li><input type='button' id='next-song' value='Next song'></li>
        <li><input type='button' id='like' value='Like'> :: <input type='button' id='dislike' value='Dislike'></li>
    </ul>

    <p>
        <?php
        if ($status) {
            echo "<span id='title'>{$status['title']}</span><br><span id='artist'>{$status['artist']}</span><br><span id='album'>{$status['album']}</span>";
            echo '<br><br>';
            $rating = getHermesRating($status['rating']);
            $position = formatHermesTime($status['position']);
            $duration = formatHermesTime($status['duration']);
            echo "<span id='rating'>{$rating}</span> :: <span id='time'>{$position}/{$duration}</span>";
            echo '<br>';
            echo "<img id='artwork' src=\"{$status['artwork']}\">";
        }
        ?>
    </p>
</body>
