DROP TABLE IF EXISTS Settings;

CREATE TABLE Settings (
    SettingID INT8 NOT NULL AUTO_INCREMENT,
    Name NVARCHAR(128) NOT NULL,
    Value NVARCHAR(128) NOT NULL,
    PRIMARY KEY (SettingID)
)  ENGINE = INNODB;

CREATE INDEX IX_Settings_Name on Settings(Name);

INSERT INTO Settings (Name, Value) VALUES ('Commission', '0.1');