DROP table Transactions;

CREATE TABLE Transactions (
    TransactionID INT8 NOT NULL AUTO_INCREMENT,
    TransactionType ENUM(
		'FromUserToTask', 
        'FromTaskToUser', 
        'FromUserToUser', 
        'FromUserToSystem', 
        'FromTaskToSystem', 
        'FromSystemToUser') NOT NULL,
    SourceUserID INT8 NULL,
    TargetUserID INT8 NULL,
    SourceTaskID INT8 NULL,
    TargetTaskID INT8 NULL,
    Amount DECIMAL NOT NULL,
    Created TIMESTAMP,
    PRIMARY KEY (TransactionID),
    KEY (TargetTaskID)
)  ENGINE=INNODB;

create index IX_Transactions_SourceUserID on `tasks_platform`.Transactions(SourceUserID);
create index IX_Transactions_TargetUserID on `tasks_platform`.Transactions(TargetUserID);
create index IX_Transactions_SourceTaskID on `tasks_platform`.Transactions(SourceTaskID);
-- create index IX_Transactions_TargetTaskID on `tasks_platform`.Transactions(TargetTaskID);