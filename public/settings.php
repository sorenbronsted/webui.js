<?php
namespace ufds;

$loader = require dirname(__DIR__).'/vendor/autoload.php'; // Use composer autoloading

$dic = DiContainer::instance();
$dic->config = new Config2(__DIR__.'/web.ini');
$dic->log = Log::createFromConfig();
$dic->header = new Header();
$dic->request = new Request();

date_default_timezone_set("Europe/Copenhagen");
openlog("ufds-webui", LOG_PID | LOG_CONS, LOG_LOCAL0);

