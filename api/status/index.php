<?php
require_once(__DIR__ . '/../_scripts/hermes.lib.php');

expectHTTPMethod('GET');
sendJSONResponse(getHermesStatus());
