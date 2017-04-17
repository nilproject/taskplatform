<?php

include_once "../../backend/tools.php";
include_once "../../backend/db/user.php";
include_once "../../backend/security.php";

checkAuthentication();

$result = getUserInfo(intval($_COOKIE['userid']));

if (!$result)
    dieWithCode(404);

echo json_encode($result);