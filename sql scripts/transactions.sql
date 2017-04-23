SHOW ERRORS;

DROP TABLE IF EXISTS Transactions;

CREATE TABLE Transactions (
    TransactionID INT8 NOT NULL AUTO_INCREMENT,
    Direction ENUM(
		'FromUserToTask', 
        'FromTaskToUser', 
        'FromUserToUser', 
        'FromUserToSystem', 
        'FromTaskToSystem', 
        'FromSystemToUser') NOT NULL,
    SourceID INT8 NULL,
    TargetID INT8 NULL,
    Amount DECIMAL(16,4) NOT NULL,
    Created INT8,
    PRIMARY KEY (TransactionID)
)  ENGINE = INNODB;

create index IX_Transactions_SourceID on Transactions(SourceID);
create index IX_Transactions_TargetID on Transactions(TargetID);

INSERT INTO Transactions (Direction, SourceID, TargetID, Amount, Created)

SELECT * FROM Transactions;