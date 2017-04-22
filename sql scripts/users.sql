SHOW ERRORS;

DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    UserID INT8 NOT NULL AUTO_INCREMENT,
    VkUserID INT8 NOT NULL,
    `Name` NVARCHAR(128) NOT NULL,
    Role ENUM('Customer',
              'Executor',
              'System') NOT NULL,
	Cash DECIMAL(16,4) NOT NULL,
    PRIMARY KEY (UserID), UNIQUE KEY(VkUserID)
)  ENGINE=INNODB;

CREATE INDEX IX_User_VkUserID on Users(VkUserID);

DELIMITER //
CREATE TRIGGER TR_CachEnoughCheck BEFORE UPDATE ON Users
FOR EACH ROW
BEGIN
	IF NEW.Cash < 0 THEN
		SET @msg = 'Error: Insufficient funds';
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @msg;
	END IF;
END;
//

INSERT INTO Users (VkUserID, `Name`, Role, Cash) 
VALUES (0, 'system', 'System', 0);

UPDATE Users SET Cash = Cash + 100.0 WHERE UserID = 1;
UPDATE Users SET Cash = Cash - 100.0 WHERE UserID = 1;

SELECT * FROM Users;