const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

// initital routes
const consRoutes = require('./api/routes/constructor')
const obatRoutes = require('./api/routes/obat')
const userRoutes = require('./api/routes/user')
const kategoriRoutes = require('./api/routes/kategori')
const penjualanRoutes = require('./api/routes/penjualan')
const pembelianRoutes = require('./api/routes/pembelian')

const cors_option = {
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
}

app.use(cors(cors_option))

// connection mongoodb to server online
// mongoose.connect('mongodb://dev:zpUrdFc7YWY9e2uE@nodejs-rest-shard-00-00-ogfza.mongodb.net:27017,nodejs-rest-shard-00-01-ogfza.mongodb.net:27017,nodejs-rest-shard-00-02-ogfza.mongodb.net:27017/test?ssl=true&replicaSet=nodejs-rest-shard-0&authSource=admin')
// .then(resp => {
//     console.log('Mongodb Online !!');
// })
// .catch(err => {
//     console.error(err);    
// })

// mongodb localhost
mongoose.connect('mongodb://localhost:27017/apotek', { useNewUrlParser: true })
app.use(morgan('dev'))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// use routes
app.use('/api/check', consRoutes)
app.use('/api/user', userRoutes)
app.use('/api/obat', obatRoutes)
app.use('/api/kategori', kategoriRoutes)
app.use('/api/penjualan', penjualanRoutes)
app.use('/api/pembelian', pembelianRoutes)

// handling error
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) =>{
   res.status(error.status || 500)
   res.json({
       error:{
           message: error.message
       }
   }) 
})


module.exports = app