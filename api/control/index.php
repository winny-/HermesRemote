<?php
require_once(__DIR__ . '/../_scripts/hermes.lib.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	return;
}

$argument = (array_key_exists('argument', $_POST)) ? $_POST['argument'] : NULL;
echo json_encode(sendHermesCommand($_POST['command'], $argument));
return;
