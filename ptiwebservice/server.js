const http = require('http')
const port = process.env.PORT || 3000
const app = require('./app')

const server = http.createServer(app)

process.on('SIGINT', () => {
  console.log('\nClosing service')
  process.exit()
})

server.listen(port)
