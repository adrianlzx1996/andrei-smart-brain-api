BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) VALUES ('Jessie', 'jessie@gmail.com', 5, '2021-08-28')
INSERT INTO login (hash, email) VALUES ('$2a$12$2yx1PB7x1lIWzRRvbMSq5O8pqeSOsiWi986jqFBdfy8fabHGZqE6W', 'jessie@gmail.com');

COMMIT;