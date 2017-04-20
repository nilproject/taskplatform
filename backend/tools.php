<?php

function dieWithCode($code) {
    $codeDescription = strval($code);
    switch ($code) {
        case 200: $codeDescription .= ' Success'; break;
        case 400: $codeDescription .= ' Bad Request'; break;
        case 401: $codeDescription .= ' Unauthorized'; break;
        case 403: $codeDescription .= ' Forbidden'; break ;
        case 404: $codeDescription .= ' Not Found'; break;
        case 500: $codeDescription .= ' Internal Rrror'; break;
    }

    header('HTTP/1.1 ' . $codeDescription, true, $code); die($code);
}

function echoSuccess() {
    header("Content-type: application/json");
    echo '{ "result" : "success" }';
}

function echoJson($object) {
    header("Content-type: application/json");
    echo json_encode($object);
}

function now(){
    return intval(microtime(true) * 1000);
}