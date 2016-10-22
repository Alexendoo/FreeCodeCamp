'use strict'

const express = require('express')
const pg = require('pg')
const url = require('url')

const params = url.parse(process.env.DATABASE_URL)
const auth = params.auth.split(':')

const app = express()
const pool = new pg.Pool({
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
})

app.get('/:url', function(request, response) {
  console.log('url')
})

app.get('/new/:url', function(request, response) {
  console.log('new/url')
})

pool
  .query(`CREATE TABLE IF NOT EXISTS urls(
    id   SERIAL  PRIMARY KEY,
    url  TEXT    NOT NULL
  );`)
  .then(function() {
    app.listen(prcoess.env.PORT || 8080)
  })