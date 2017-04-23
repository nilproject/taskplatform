<?php

include_once "commondb.php";

function getSetting($settingName) {
    return db_query('SELECT value 
                     FROM Settings
                     WHERE Name = ?',
                     [
                         $settingName
                     ],
                     's')[0];
}

function setSetting($settingName, $value) {
    return db_query('UPDATE Settings
                     SET Value = ?
                     WHERE Name = ?',
                     [
                         $value,
                         $settingName
                     ],
                     'ss')[0];
}