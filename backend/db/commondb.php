<?php

function db_query($query) {
    $link = mysqli_connect($_SERVER["DB_HOST"], $_SERVER["DB_LOGIN"], $_SERVER["DB_PASS"], $_SERVER["DB_NAME"])
        or die('dberror: ' . mysql_error());    

    try {
        $queryResult = mysqli_query($link, $query);
        $result = mysqli_fetch_all($queryResult);
        return $result;
    } finally {
        mysqli_close($link);
    }
}