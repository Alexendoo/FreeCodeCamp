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

const RADIX = 36

// Ignore for debugging
app.get('/favicon.ico', function(request, response) {
  response.sendStatus(200)
})

app.get('/:short', function(request, response) {
  const id = parseInt(request.params.short, RADIX)

  pool.query(`SELECT url FROM urls WHERE id=$1;`, [id])
    .then(result => {
      response.redirect(result.rows[0].url)
    })
    .catch(console.error.bind(console))
})

app.get(/^\/new\/.+/, function(request, response) {
  const newUrl = url.parse(request.url.slice(5))

  response.setHeader('Content-Type', 'application/json')

  if (!(newUrl.protocol && newUrl.host)) {
    response.status(400)
    response.end('{"error": "bad request"}')
    return
  }

  pool.query(`INSERT INTO urls (url) VALUES ($1) RETURNING id;`, [newUrl.href])
    .then(result => {
      const id = result.rows[0].id
      response.end(JSON.stringify({
        original_url: newUrl.href,
        short_url: id.toString(RADIX)
      }))
    })
    .catch(console.error.bind(console))
})

pool
  .query(`CREATE TABLE IF NOT EXISTS urls (
    id   SERIAL  PRIMARY KEY,
    url  TEXT    NOT NULL
  );`)
  .then(function() {
    app.listen(process.env.PORT || 8080)
  })