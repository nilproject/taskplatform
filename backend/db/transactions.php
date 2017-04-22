<?php

include_once "commondb.php";

const TRANSACTION_DIRECTION_FromUserToTask = 'FromUserToTask';
const TRANSACTION_DIRECTION_FromTaskToUser = 'FromTaskToUser';
const TRANSACTION_DIRECTION_FromUserToUser = 'FromUserToUser';
const TRANSACTION_DIRECTION_FromUserToSystem = 'FromUserToSystem';
const TRANSACTION_DIRECTION_FromTaskToSystem = 'FromTaskToSystem';
const TRANSACTION_DIRECTION_FromSystemToUser = 'FromSystemToUser';

function createTransaction($direction, $sourceId, $targetId, $amount) {
    return db_query("INSERT INTO Transactions (Direction, SourceID, TargetID, Amount, Created)
                     VALUES (?, ?, ?, ?, ?)",
                     [
                         $direction,
                         $sourceId, 
                         $targetId, 
                         $amount,
                         now()
                     ], 
                     'siidi');
}