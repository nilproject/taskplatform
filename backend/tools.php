<?php

function dieWithCode($code) {
    $codeDescription = strval($code);
    switch ($code) {
        case 200: $codeDescription .= ' Success'; break;
        case 400: $codeDescription .= ' Bad Request'; break;
        case 401: $codeDescription .= ' Unauthorized'; break;
        case 402: $codeDescription .= ' Payment Required'; break;
        case 403: $codeDescription .= ' Forbidden'; break;
        case 404: $codeDescription .= ' Not Found'; break;
        case 409: $codeDescription .= ' Conflict'; break;
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

function checkResponse($response, $errorCode = 400, $hideErrorMessage = false) {
    if ($response === null)
        dieWithCode(500);

    if (array_key_exists("error", $response)) {
        if ($hideErrorMessage) {
            echo '{ "error" : "Internal error" }';
        } else {
            echoJson($response["error"]);
        }
        
        dieWithCode($errorCode);
    }
}