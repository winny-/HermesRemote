<?php

require_once(__DIR__ . '/hermes.lib.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    sendHermesCommand($_POST['command']);
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