<?php

include "../../backend/tools.php";
include "../../backend/db/user.php";
include "../../backend/security.php";

checkAuthentication();

if (!$_COOKIE['userid'] || !val($_COOKIE['userid']))
    dieWithCode(400);

$result = getUserInfo(val($_COOKIE['userid']));

if (!$result)
    dieWithCode(404);

echo json_encode($result);