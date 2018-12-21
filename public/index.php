<?php
namespace ufds;

use Exception;

require_once 'settings.php';

$dic = DiContainer::instance();
try {
	if (preg_match('#^/rest/.*#', $_SERVER['REQUEST_URI'])) {
		echo Rest::run($_SERVER, $_REQUEST);
	}
	else {
		readfile(__DIR__.'/html/main.html');
	}
}
catch(Exception $e) {
	$dic->log->error(__CLASS__, $e->getMessage());
	$dic->log->error(__CLASS__, $e->getTraceAsString());
	$dic->header->out($_SERVER['SERVER_PROTOCOL']. " 500 ".$e->getMessage());
}
