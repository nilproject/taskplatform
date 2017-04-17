<?php

function dieWithCode($code) {
    $codeDescription = strval($code);
    switch ($code) {
        case 200: $codeDescription .= ' Success'; break;
        case 400: $codeDescription .= ' Bad Request'; break;
        case 401: $codeDescription .= ' Unauthorized'; break;
        case 403: $codeDescription .= ' Forbidden'; break ;
        case 404: $codeDescription .= ' Not Found'; break;
    }


    header('HTTP/1.1 ' . $codeDescription, true, $code); die($code);
}

function echoSuccess() {
    echo '{ "result" : "success" }';
}