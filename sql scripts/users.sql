SHOW ERRORS;

DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    UserID INT8 NOT NULL AUTO_INCREMENT,
    VkUserID INT8 NOT NULL,
    `Name` NVARCHAR(128) NOT NULL,
    Login NVARCHAR(24) NULL,
    PasswordHash NVARCHAR(64) NULL,
    Role ENUM('Сustomer', 'Executor', 'System') NOT NULL,
    PRIMARY KEY (UserID), KEY(VkUserID), KEY(Login)
)  ENGINE=INNODB;

CREATE INDEX IX_User_VkUserID on Users(VkUserID);
CREATE INDEX IX_User_Login on Users(Login);