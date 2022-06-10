--Create database before create tables.
CREATE DATABASE empmoni_db;

-- Create roles in the system.
INSERT INTO roles(name) values ('ROLE_USER');
INSERT INTO roles(name) values ('ROLE_MODERATOR');
INSERT INTO roles(name) values ('ROLE_ADMIN');

