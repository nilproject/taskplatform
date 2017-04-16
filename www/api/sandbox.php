<?php

if (!$_GET['vkuserid'] || !intval($_GET['vkuserid'])) {
    echo "1";
    dieWithCode(400);
}

if (!$_GET['hash']) {
    echo "2";
    dieWithCode(400);
}

checkVkAuthentication($_GET['vkuserid'], $_GET['hash']);