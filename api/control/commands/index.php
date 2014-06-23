<?php
require_once(__DIR__ . '/../../_scripts/hermes.lib.php');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
	http_response_code(405);
	return;
}

header('Content-Type: application/json');
echo json_encode($hermesCommands);
return;
