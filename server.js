'use strict';

/***
 * Dependencies
 */

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

/**
 * Environment variables
 */

require('dotenv').config();
const PORT = process.env.PORT || 3001;

/**
 * Application Setup
 */

const app = express();
app.listen(PORT, () => {
  console.log('listening on', PORT);
  // TODO: Change to reflect actual status.  This does not exactly work!
});

/**
 * Database Setup
 */

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => handleError(err));
client.connect();

/**
 * Middleware
 */

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));

// Set view engine for server-side templating
app.set('view engine', 'ejs');

/**
 * Routes
 */


app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.get('/', getBookList);
app.get('/search', getSearchForm);
app.post('/search', postGoogleResults);
app.get('/books/:data_id', getSingleBookDetail);
app.get('/update/:data_id', getEditBookDetail);

app.post('/books', postAddToShelf);
app.delete('/books/:data_id', deleteBook);
app.put('/update/:data_id', putUpdateBook);


/**
 * Route Handlers
 */

function getBookList(req, res) {
  response.render('/pages/index');
}

function getSearchForm(req, res) {
  response.render('/pages/searches/new');
}

function postGoogleResults(req, res) {
  response.render('/pages/searches/show');
}

function getSingleBookDetail(req, res) {
  response.render('/pages/books/detail');
}

function (req, res) {
  response.render('/pages/');
} 

function getEditBookDetail(req, res) {
  response.render('/pages/books/edit');
}

function getSearchForm(request, response){
  response.render('pages/searches/new');
}

function postAddToShelf(req, res) {
  response.redirect('/');
}

function deleteBook(req, res) {
  response.redirect('/');
}

function putUpdateBook(req, res) {
  response.redirect('/');
}

function postGoogleResult(request, response){
  // console.log(request.body.search);
  console.log('search for books is alive');
  const searchItem = request.body.search[0];
  const searchingBy = request.body.search[1];

  let url = `https://www.googleapis.com/books/v1/volumes?q=`;

  if(searchingBy === 'title'){
    // console.log('in first if')
    url = `${url}intitle:${searchItem}`;
  }
  if(searchingBy === 'author'){
    // console.log('in first if')
    url = `${url}inauthor:${searchItem}`;
  }

  superagent.get(url)
    .then(superagentResults => {
      // console.log(superagentResults.body.items);
      //want to send results to new page called api results
      const library = superagentResults.body.items.map(book => new Book(book));
      // console.log(library);
      response.render('pages/searches/show', { results: library });
    });
}

const toHttps = (url) => url.replace(/^http:/i, 'https:');

function Book(info) {
  // console.log(info.volumeInfo);
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  const obj = info.volumeInfo;
  this.id = info.id;
  this.title = obj.title || 'no title available';
  this.imageUrl = toHttps(obj.imageLinks.thumbnail || placeholderImage);
  this.author = (obj.authors || ['No Author Available']).join(', ');
  this.description = obj.description || 'No Description available';
  this.isbn = obj.industryIdentifiers[0].identifier || 'No ISBN Available';
  console.log(this);
}

// function hello(request, response) {
//   // console.log(request.body);
//   console.log('hello');
//   response.render('pages/index');
// }

function getBookList(request, response) {
  let SQL = 'SELECT books.*, bookshelves.name as bookshelf FROM books INNER JOIN bookshelves ON books.bookshelf_id = bookshelves.id;';
  let values = [];

  return client
    .query(SQL, values)
    .then(results => {
      logDbResult(results, SQL);
      response.render('pages/index', {results: results.rows});
    })
    .catch(err => handleError(err, response));
}

// ========================================
//Elle's functions:

function getSingleBookDetail(request, response) {
  console.log(request.params.data_id);

  let SQL = 'SELECT books.*, bookshelves.name as bookshelf FROM books INNER JOIN bookshelves ON books.bookshelf_id = bookshelves.id WHERE books.id=$1;';
  let values = [request.params.data_id];

  return client
    .query(SQL, values)
    .then(results => {
      logDbResult(results, SQL);
      response.render('pages/books/show', { results: results.rows });
    })
    .catch(err => handleError(err, response));
}

// ======================================

/**
 * Helper Objects and Functions
 */

function logDbResult(pgResults, sql) {
  console.log('===========================');
  if (sql) {
    console.log(`SQL --> ${sql}`);
  }
  console.log('Row Count', pgResults.rowCount);
  if ((pgResults.rowCount !== 0) && (pgResults.rows[0])) {
    console.log('first row:', pgResults.rows[0]);
  }
}

function handleError(err, response) {
  console.log('ERROR START ==================');
  console.error(err);
  console.log('ERROR END ====================');

  if (response) {
    response
      .status(500)
      .render('pages/error', {
        header: 'Uh Oh something went wrong :(',
        //TODO: create constructor to display JSON err obj for client
        error: JSON.stringify(err)
      });
  }
}
