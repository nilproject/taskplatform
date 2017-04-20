<?php

include_once "../backend/security.php";

removeCookie();

header('HTTP/1.1 303 See Other', true, 303);
header('Location: /');