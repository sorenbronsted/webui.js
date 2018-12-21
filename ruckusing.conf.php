<?php
require_once 'web/settings.php';

//----------------------------
// DATABASE CONFIGURATION
//----------------------------
return array(
  'db' => array(
      'development' => array(
        'type'      => $dic->config->defaultDb_driver,
        'host'      => $dic->config->defaultDb_host,
        'port'      => $dic->config->defaultDb_port,
        'database'  => $dic->config->defaultDb_name,
        'user'      => $dic->config->defaultDb_user,
        'password'  => $dic->config->defaultDb_password,
        'charset'   => $dic->config->defaultDb_charset
      ),
    ),
  'ruckusing_base' => __DIR__.'/vendor/ruckusing/ruckusing-migrations',
  'migrations_dir' => RUCKUSING_WORKING_BASE . '/database',
  'db_dir' => RUCKUSING_WORKING_BASE . '/db',
  'log_dir' => '/tmp',
);

?>
