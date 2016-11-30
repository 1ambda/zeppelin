#!/usr/local/bin/dumb-init /bin/sh
$Z_HOME/bin/zeppelin-daemon.sh start
$(which tail) -F -q $Z_HOME/logs/*

