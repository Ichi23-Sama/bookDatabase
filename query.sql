CREATE TABLE books(
	id SERIAL PRIMARY KEY,
	name VARCHAR(50),
	rating FLOAT,
	review TEXT,
	dateadded date
);

INSERT INTO books (name, rating, review, dateadded)
VALUES ('Lord of the Rings', 7.4, 'It was an extremely dramatic book', '2019-04-09');

INSERT INTO books (name, rating, review, dateadded)
VALUES('Goblin Slayer', 5.5, 'Goblin quest go brrr', '2020-5-30');

SELECT TO_CHAR(dateadded::date, 'Mon dd, yyyy')
FROM books
WHERE id = 1;

UPDATE books
SET author = 'J.R.R. Tolkien'
WHERE id = 1;
