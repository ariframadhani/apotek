const mongoose = require('mongoose')

const constructorSchema = mongoose.Schema({
    status: { type: String },
}) 

module.exports = mongoose.model('Constructor', constructorSchema)