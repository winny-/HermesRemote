<?php

require_once(__DIR__ . '/hermes.lib.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$argument = (array_key_exists('argument', $_POST)) ? $_POST['argument'] : NULL;
    sendHermesCommand($_POST['command'], $argument);
    return;
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $status = getHermesStatus();
    header('Content-Type: application/json');
    echo json_encode($status);
    return;
} else {
    http_response_code(500);
    return;
}

?>