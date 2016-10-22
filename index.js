'use strict'

const http = require('http')

const server = http.createServer()

server.on('request', function(request, response) {
  let language
  let software
  let ipaddress = request.connection.remoteAddress

  const acceptLanguage = request.headers['accept-language']
  if (acceptLanguage) {
    language = acceptLanguage.split(/[,;]/)[0]
  }

  const userAgent = request.headers['user-agent']
  if (userAgent) {
    const start = userAgent.indexOf('(') + 1
    const end = userAgent.indexOf(')')

    software = userAgent.substring(start, end)
  }

  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify({language, software, ipaddress}))
})

server.listen(process.env.PORT || 8080)