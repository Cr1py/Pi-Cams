-- Description: Seed data for the database
-- Group 31
-- Date: November 20, 2023

INSERT INTO  SecuritySystem (version ,name, address) VALUES (0,'Home', '22 Richmond Street');
INSERT INTO  SecuritySystem (version ,name, address) VALUES (0,'Cottage', '10 Yonge Street');

INSERT INTO  Device (version ,name, type, securitysystem_id) VALUES (0,'FrontDoor', 'camera', 1);
INSERT INTO  Device (version ,name, type, securitysystem_id) VALUES (0,'SideDoor', 'motion', 1);

INSERT INTO  User (version ,name, password, email, mobile,  securitysystem_id) VALUES (0,'Amy', 'password', 'amy@email.com', '416-555-5551', 1);
INSERT INTO  User (version ,name, password, email, mobile,  securitysystem_id) VALUES (0,'Christine', 'password', 'christine@email.com', '416-555-5552', 1);
INSERT INTO  User (version ,name, password, email, mobile,  securitysystem_id) VALUES (0,'Jackie', 'password', 'jackie@email.com', 416-555-5553, 1);
INSERT INTO  User (version ,name, password, email, mobile,  securitysystem_id) VALUES (0,'Amanda', 'password', 'amanda@email.com', 416-555-5554, 1);

