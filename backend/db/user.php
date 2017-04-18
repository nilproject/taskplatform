<?php

include_once "commondb.php";
include_once "../security.php";

function getUserInfo($userId) {
    return db_query('SELECT userId, vkUserId, `name`, role FROM Users 
                     WHERE UserID = ?',
                     [
                         $userId
                     ],
                     'i')[0];   
}

// Internal call only!
function getUsers($userIds) {
    $ids = "";

    foreach ($userIds as $key => $value) {
        if ($ids !== "")
            $ids .= ",";

        $ids .= $value;
    }

    return db_query('SELECT userId, vkUserId, `name`, role FROM Users 
                     WHERE UserID IN (' . $ids . ")");
}

function getUserRole($userId) {
    return db_query('SELECT role FROM Users 
                     WHERE UserID = ?',
                     [
                         $userId
                     ],
                     'i')[0];   
}

function getUserIdByVkId($vkUserId) {
    return db_query('SELECT userId FROM Users 
                     WHERE VkUserID = ?',
                     [
                         $vkUserId
                     ],
                     'i')[0];
}

function createUser($vkUserId, $login, $pass, $role, $name) {
    $passHash = makePassHash($login, $pass);

    return db_query('INSERT INTO Users (VkUserID, `Name`, Login, PasswordHash, Role) 
                     VALUES (?, ?, ?, ?, ?)',
                     [
                         $vkUserId,
                         $name,
                         $login,
                         $passHash,
                         $role
                     ],
                     'issss');
}