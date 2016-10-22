'use strict'

const http = require('http')
const moment = require('moment')

const server = http.createServer()

server.on('request', function(request, response) {
  const timeString = decodeURIComponent(request.url.slice(1))
  let time

  if (validInt(timeString)) {
    time = moment.unix(parseInt(timeString))
  } else {
    time = moment(new Date(timeString))
  }

  response.setHeader('Content-Type', 'application/json')

  if (!time.isValid()) {
    response.end('{"unix":null,"natural":null}')
    return
  }

  const unix = time.unix()
  const natural = time.format('MMMM D, YYYY')

  response.end(JSON.stringify({unix, natural}))
})

server.listen(process.env.PORT || 8080)

/**
 * @param {string} str
 * @returns {boolean} if str represents an integer
 */
function validInt(str) {
  return parseInt(str, 10).toString() === str
}