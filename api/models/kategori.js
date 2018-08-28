const mongoose = require('mongoose')
const soft_delete = require('mongoose-deleted')

// kategori barang
const kategoriSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    note: { type: String },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date:{
        created_at: {type:Date, default: Date.now}
    }
}) 

kategoriSchema.plugin(soft_delete, { select : true })

module.exports = mongoose.model('Kategori', kategoriSchema)