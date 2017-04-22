<?php

include_once "commondb.php";
include_once "../security.php";

function getUserInfo($userId) {
    return db_query('SELECT userId, vkUserId, `name`, role, cash FROM Users 
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

        $ids .= intval($value);
    }

    return db_query('SELECT userId, vkUserId, `name`, role, cash FROM Users 
                     WHERE UserID IN (' . $ids . ")", [], "");
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

function createUser($vkUserId, $role, $name) {
    return db_query('INSERT INTO Users (VkUserID, `Name`, Role, Cash) 
                     VALUES (?, ?, ?, 0)',
                     [
                         $vkUserId,
                         $name,
                         $role
                     ],
                     'iss');
}

function withdrawFunds($userId, $amount) {
    if (!is_numeric($amount) || doubleval($amount) < 0) {
        die("Incorrect amount");
    }

    return db_query('UPDATE Users 
                     SET Cash = Cash - ? 
                     WHERE UserID = ?',
                     [
                         $amount,
                         $userId
                     ],
                     'si');
}

function enrollFunds($userId, $amount) {
    if (!is_numeric($amount) || doubleval($amount) < 0) {
        die("Incorrect amount");
    }

    return db_query('UPDATE Users 
                     SET Cash = Cash + ? 
                     WHERE UserID = ?',
                     [
                         $amount,
                         $userId
                     ],
                     'si');
}