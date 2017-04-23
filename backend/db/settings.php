<?php

include_once "commondb.php";

function getSetting($settingName) {
    return db_query('SELECT value FROM Settings
                     WHERE Name = ?',
                     [
                         $settingName
                     ],
                     's')[0];
}