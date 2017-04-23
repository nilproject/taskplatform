<?php

include_once "../../backend/tools.php";
include_once "../../backend/db/user.php";
include_once "../../backend/security.php";

checkAuthentication();

deleteUser($_COOKIE["userid"]);

echoSuccess();