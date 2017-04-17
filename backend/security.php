<?php

include_once "tools.php";

function checkAuthentication() {
    $secKey = $_SERVER['SEC_KEY'];
    $userId = $_COOKIE['userid'];
    $hash   = $_COOKIE['hash'];

    if ($hash !== hash("sha256", $userId . $secKey)) {
        dieWithCode(401);
    }
}

function makeAuthHash($userId) {
    $secKey = $_SERVER['SEC_KEY'];

    return hash("sha256", $userId . $secKey);
}

function makePassHash($login, $pass) {
    return hash("sha256", $login . $pass);
}

function checkVkAuthentication($userId, $hash) {
    $appid  = $_SERVER['VK_APPID'];
    $secKey = $_SERVER['SEC_KEY'];

    if ($hash !== hash("md5", $appid . $userId . $secKey)) {
        dieWithCode(401);
    }
}