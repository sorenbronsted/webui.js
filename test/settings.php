<?php
namespace ufds;

$loader = require 'vendor/autoload.php';
$loader->addPsr4('ufds\\', 'test/utils');
$loader->addPsr4('ufds\\', 'test/webdriver');

date_default_timezone_set("Europe/Copenhagen");
error_reporting(E_ALL|E_STRICT);
openlog("ufds-webui", LOG_PID | LOG_CONS, LOG_LOCAL0);

$dic = DiContainer::instance();
$dic->config = new Config2(__DIR__.'/webui.ini');
$dic->log = Log::createFromConfig();
$dic->header = new Header();
$dic->request = new Request();
