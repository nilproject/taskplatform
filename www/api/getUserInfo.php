<?php

include_once "../../backend/tools.php";
include_once "../../backend/db/user.php";
include_once "../../backend/security.php";

if (!$_COOKIE['userid'] || !intval($_COOKIE['userid']))
    dieWithCode(400);

checkAuthentication();

$result = getUserInfo(intval($_COOKIE['userid']));

if (!$result)
    dieWithCode(404);

echo json_encode($result);