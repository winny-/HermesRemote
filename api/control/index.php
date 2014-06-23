<?php
require_once(__DIR__ . '/../_scripts/hermes.lib.php');

expectHTTPMethod('POST');

$argument = (array_key_exists('argument', $_POST)) ? $_POST['argument'] : NULL;
$success = sendHermesCommand($_POST['command'], $argument);
sendJSONResponse($success);
