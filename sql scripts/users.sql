SHOW ERRORS;

DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    UserID INT8 NOT NULL AUTO_INCREMENT,
    VkUserID INT8 NOT NULL,
    `Name` NVARCHAR(128) NOT NULL,
    Login NVARCHAR(24) NULL,
    PasswordHash NVARCHAR(64) NULL,
    Role ENUM('Customer', 'Executor', 'System') NOT NULL,
    PRIMARY KEY (UserID), UNIQUE KEY(VkUserID), UNIQUE KEY(Login)
)  ENGINE=INNODB;

CREATE INDEX IX_User_VkUserID on Users(VkUserID);
CREATE INDEX IX_User_Login on Users(Login);

INSERT INTO Users (VkUserID, `Name`, Login, PasswordHash, Role) 
VALUES (0, 'system', 'admin', 'd82494f05d6917ba02f7aaa29689ccb444bb73f20380876cb05d1f37537b7892', 'System');

SELECT * FROM Users;