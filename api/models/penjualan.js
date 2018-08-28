const mongoose = require('mongoose')
const mongoose_id_validator = require('mongoose-id-validator')
const mongoose_paginate = require('mongoose-paginate')

const penjualanSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    invoice: { type: String, required: true, unique: true},
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cashier: { type: String },
    total: { type: Number, default: 0 },
    cash: { type: Number, default: 0 },
    change: { type: Number, default: 0 },
    recipe: { type: Number, default: 0 },
    created_at: {
        type: Date, default: Date.now
    }
})

penjualanSchema.plugin(mongoose_paginate)
penjualanSchema.plugin(mongoose_id_validator)
module.exports = mongoose.model('Penjualan', penjualanSchema)