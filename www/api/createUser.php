<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/user.php";
include_once "../../backend/db/transactions.php";

if (!is_numeric($_GET['vkuserid']))
    dieWithCode(400);

if (!$_GET['hash'])
    dieWithCode(400);

checkVkAuthentication($_GET['vkuserid'], $_GET['hash']);

$userId = 0;
$result = createUser(
    intval($_GET['vkuserid']),
    urldecode($_GET['role']), 
    urldecode($_GET['name']),
    true, // Для тестирования удобно всем раздать права администратора
    $userId);

checkResponse($result);
echoSuccess();