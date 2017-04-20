<?php

include_once "tools.php";
include_once "../../backend/db/user.php";

function checkAuthentication() {
    $userId = $_COOKIE['userid'];
    $hash   = $_COOKIE['hash'];

    if ($hash !== makeAuthHash($userId)
        && $hash !== makeAuthHash($userId, true)) {
        dieWithCode(401);
    }
}

function updateUserAuthInfo($userId){
    $hash = makeAuthHash($userId);

    if (!isset($_COOKIE["hash"]) || $_COOKIE["hash"] !== $hash) {
        setcookie("userid", $userId, 0, "", parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST), false, true);
        setcookie("hash", $hash, 0, "", parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST), false, true);
    }
}

function makeAuthHash($userId, $prev) {
    $secKey = $_SERVER['SEC_KEY'];
    $time = intval(now() / (5 * 60 * 1000));
    if ($prev)
        $time--;

    return hash("sha256", $userId . $secKey . $time);
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

function checkRole($userId, $expectedRole) {
    $role = getUserRole($userId);
    if ($role["role"] !== $expectedRole) {
        dieWithCode(403);
    }
}