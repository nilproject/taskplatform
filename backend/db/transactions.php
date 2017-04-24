<?php

include_once "commondb.php";

function getTransactions($limit, $timestamp, $compareDirection) {
    $query = "SET @timestamp = ?; GO;
              SET @compareDirection = ?; GO;

              CREATE TEMPORARY TABLE tmp_temp
              SELECT * 
              FROM Transactions 
              WHERE (@compareDirection = 0 AND (Created < @timestamp))
                 || (@compareDirection != 0 AND (Created > @timestamp))
              ORDER BY Created DESC 
              LIMIT ?;
              GO;

              SET @created = (SELECT MIN(Created) FROM tmp_temp);
              GO;

              CREATE TEMPORARY TABLE tmp_temp2 
              SELECT *
              FROM Transactions 
              WHERE Created = @created;
              GO;

              CREATE TEMPORARY TABLE tmp_result
              SELECT *
              FROM tmp_temp
              WHERE created != @created 
              UNION ALL 
              SELECT *
              FROM tmp_temp2;
              GO;
            
              SELECT transactionID, direction, sourceID, targetID, amount, created FROM tmp_result";
 
    return db_query(
            $query, 
            [ $timestamp, $compareDirection, $limit ],
            'iii');
}

function createTransaction($direction, $sourceId, $targetId, $amount, $part = 1.0) {
    return db_query("INSERT INTO Transactions (Direction, SourceID, TargetID, Amount, Created)
                     VALUES (?, ?, ?, ? * ?, ?)",
                     [
                         $direction,
                         $sourceId, 
                         $targetId, 
                         $amount,
                         $part,
                         now()
                     ], 
                     'siiddi');
}

function computeUserCash($userId) {
    return db_query("SELECT SUM(Amount) AS cash
                     FROM Transactions 
                     WHERE Direction IN ( 
                             'FromTaskToUser', 
                             'FromUserToUser',
                             'FromSystemToUser')
                     AND TargetID = ?",
                     [
                         $userId
                     ], 
                     'i')[0];
}