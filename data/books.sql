DROP DATABASE book_database;
CREATE DATABASE book_database; 

\c book_database;

DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf_ID INTEGER
);

-- id as the primary key
-- author
-- title
-- isbn
-- image_url
-- description
-- bookshelf

INSERT INTO books (author, title, isbn, image_url, description)
VALUES('Lewis Carroll', 'Alices Adventures in Wonderland', '9781579730130', 'http://books.google.com/books/content?id=BJ6u9sIgmfUC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'Story based on the motion picture, Walt Disneys Alice in Wonderland.');


INSERT INTO books (author, title, isbn, image_url, description)
VALUES ()
-- INSERT INTO book (author, title, isbn, image_url, description) 
-- VALUES('Make Dinner', 'order the thai food', 'Budha Ruska', 'not done', 'food');

