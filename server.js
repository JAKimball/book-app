'use strict';

/***
 * Dependencies
 */

const express = require('express');
const superagent = require('superagent');

/**
 * Application Setup
 */

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('listening on', PORT);
});


/**
 * Middleware
 */

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

/**
 * API Routes
 */

app.get('/', newSearch)
app.get('/hello', hello);
app.get('*', (request, response) => response.status(404).send('This route does not exist'));


function newSearch(request, response){
  console.log('I am alive')
  response.render('pages/index')
}

function searchForBooks(request, response){
  console.log(request.body.search);
  //response.send(request.body);
  const searchName = request.body.search[0];
  const searchingBy = request.body.search[1];

  let url = `https://www.googleapis.com/books/v1/volumes?q=`

  if(searchingFor === 'title'){
    console.log('in first if')
    url = url+`intitle:${searchName}`;
  }
  if(searchingFor === 'author'){
    console.log('in first if')
    url = url+`inauthor:${searchName}`;
  }

  superagent.get(url)
    .then(superagentResults => {
      console.log(superagentResults.body.items);
      const library = superagentResults.body.items.map(book => {
        return new book(book);
      })
      response.send(library);
    })
}
function Book(info){
  const placeholderImage = `https://i.imgur.com/J5LVHEL.jpg`
  this.title= info.volumeInfo.title || 'no title available';
}
function hello(request, response) {
  // console.log(request.body);
  console.log('hello')
  response.render('pages/index');
}


