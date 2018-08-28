const http = require('http')
const app = require('./app')
const port = process.env.PORT || 8000

const server = http.createServer(app)

server.listen(port, function(){
    console.log('');
    console.log('\x1b[36m%s\x1b[0m', 'Success!! Aplikasi telah berjalan pada '+process.env.CLIENT);
    
})
