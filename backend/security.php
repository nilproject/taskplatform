<?php

include "./tools.php";

function checkAuthentication() {
    $secKey = $_SERVER['SEC_KEY'];
    $userId = $_GET['userid'];
    $hash   = $_GET['hash'];

    if ($hash !== hash("sha256", $userId . $secKey)) {
        dieWithCode(401);
    }
}

function makeAuthHash($userId) {
    $secKey = $_SERVER['SEC_KEY'];

    return hash("sha256", $userId . $secKey);
}

function checkVkAuthentication($userId, $hash) {
    $appid  = $_SERVER['VK_APPID'];
    $secKey = $_SERVER['SEC_KEY'];

    if ($hash !== hash("md5", $appid . $userId . $secKey)) {
        dieWithCode(401);
    }
}