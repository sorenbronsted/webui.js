<?php
namespace sbronsted;

$loader = require dirname(__DIR__).'/vendor/autoload.php'; // Use composer autoloading

$dic = DiContainer::instance();
$dic->config = new Config2(defined('WEBUI_INI') ? WEBUI_INI : __DIR__.'/web.ini');
$dic->log = Log::createFromConfig();
$dic->header = new Header();
$dic->request = new Request();

date_default_timezone_set("Europe/Copenhagen");
openlog("webui", LOG_PID | LOG_CONS, LOG_LOCAL0);

