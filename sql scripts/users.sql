SHOW ERRORS;

DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    UserID INT8 NOT NULL AUTO_INCREMENT,
    VkUserID INT8 NOT NULL,
    `Name` NVARCHAR(128) NOT NULL,
    Role ENUM('Customer', 'Executor', 'System') NOT NULL,
    PRIMARY KEY (UserID), UNIQUE KEY(VkUserID)
)  ENGINE=INNODB;

CREATE INDEX IX_User_VkUserID on Users(VkUserID);

INSERT INTO Users (VkUserID, `Name`, Role) 
VALUES (0, 'system', 'System');

SELECT * FROM Users;