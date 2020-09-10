#!/bin/sh
#set -x

host=localhost:8080
pid=server.pid

php -S $host -t public > /dev/null 2>&1 &
testResult=$?
if [ $testResult -ne 0 ]
then
  echo "$0: Server not started"
  exit $testResult
fi
echo $! > $pid

vendor/bin/phpunit --testsuite "Webdriver Test Suite"
testResult=$?

pkill --pidfile $pid
rm $pid

exit $testResult
