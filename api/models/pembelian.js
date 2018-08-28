const mongoose = require('mongoose')
const mongoose_id_validator = require('mongoose-id-validator')
const mongoose_paginate = require('mongoose-paginate')

const pembelianSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    invoice: {type: String, unique: true, required: true},
    supplyer: {type: String, required: true},
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kategori',
        required: true
    },
    name: {type: String, required: true},
    code: {type: String, required: true},
    buy_price: {type: Number, required: true},
    sale_price: {type: Number, required: true},
    buy_stok: {type: Number, required: true},
    outcome: {type: Number, required: true},
    tanggal_pembelian: {type: Date, default: Date.now, required:true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: null},
})

pembelianSchema.plugin(mongoose_id_validator)
pembelianSchema.plugin(mongoose_paginate)
module.exports = mongoose.model('Pembelian', pembelianSchema)