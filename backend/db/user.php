<?php

include_once "commondb.php";
include_once "../security.php";

function getUserInfo($userId) {
    return db_query('SELECT UserID, VkUserID, `Name`, Role FROM Users 
                     WHERE UserID = ?',
                     [
                         $userId => 'i'
                     ])[0];   
}

function getUserIdByVkId($vkUserId) {
    return db_query('SELECT UserID FROM Users 
                     WHERE VkUserID = ?',
                     [
                         $vkUserId => 'i'
                     ])[0];
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