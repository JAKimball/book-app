-- Normalize Bookshelves

-- Create the bookshelves table
CREATE TABLE bookshelves (id SERIAL PRIMARY KEY,name VARCHAR(255));

-- Populate the bookshelves table with the distinct bookshelf values from 
-- the books table.
INSERT INTO bookshelves(name) SELECT DISTINCT bookshelf FROM books;
-- Confirm success
SELECT count(*) FROM bookshelves;

-- Add a bookshelf_id column to the books table to serve as the foreign key to
-- the bookshelf table.
ALTER TABLE books ADD COLUMN bookshelf_id INT;

-- Based on the bookshelf feild, populate the bookshelf_id column of books
-- with the primary key of the corresponding bookshelf record. 
UPDATE books SET bookshelf_id=shelf.id FROM (SELECT * FROM bookshelves) AS shelf WHERE books.bookshelf = shelf.name;
-- Confirm success
SELECT bookshelf_id FROM books;

-- Remove the newly redundant column
ALTER TABLE books DROP COLUMN bookshelf;

-- Add the foreign key constraint
ALTER TABLE books ADD CONSTRAINT fk_bookshelves FOREIGN KEY (bookshelf_id) REFERENCES bookshelves(id);

-- Console Output:
-- $ psql -f migrations/1569540672268-normalize-bookshelf.sql -d lab14_normal
-- CREATE TABLE
-- INSERT 0 8
-- count
-- -------
--     8
-- (1 row)

-- ALTER TABLE
-- UPDATE 10
-- bookshelf_id
-- --------------
--             1
--             1
--             2
--             3
--             4
--             5
--             6
--             6
--             7
--             8
-- (10 rows)

-- ALTER TABLE
-- ALTER TABLE
