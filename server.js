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

app.get('/hello', hello);



function hello(request, response) {
  console.log(request.body);
  response.render('pages/index');
}


