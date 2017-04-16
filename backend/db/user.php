<?php

include_once "commondb.php";
include_once "../security.php";

function getUserInfo($userId) {
    return array('vkUserId' => $vkUserId);    
}

function getUserIdByVkId($vkUserId) {
    return db_query('SELECT UserID FROM Users 
                     WHERE VkUserID = ?',
                     [
                         $vkUserId => 'i'
                     ]);
}

function createUser($vkUserId, $login, $pass, $role, $name) {
    $passHash = makePassHash($login, $pass);
    
    return db_query('INSERT INTO Users (VkUserID, `Name`, Login, PasswordHash, Role) 
                     VALUES (?, ?, ?, ?, ?)',
                     [
                         $vkUserId => 'i',
                         $name     => 's',
                         $login    => 's',
                         $passHash => 's',
                         $role     => 's'
                     ]);
}