CREATE DATABASE Directory;
USE Directory;
CREATE TABLE Organizations (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    org_name TEXT NOT NULL,
    category TEXT NOT NULL,
    sub_category_1 TEXT,
    sub_category_2 TEXT,
    state TEXT,
    lga TEXT,
    description TEXT,
    contact_email TEXT,
    contact_address TEXT,
    contact_number TEXT,
    link TEXT
);
CREATE USER 'ingestor'@'localhost' IDENTIFIED BY 'foo';
GRANT DELETE, INSERT, UPDATE ON Directory.Organizations TO 'crisisapp'@'localhost';
CREATE USER 'crisisapp'@'localhost' IDENTIFIED BY 'bar';
GRANT SELECT ON Directory.Organizations TO 'crisisapp'@'localhost';
