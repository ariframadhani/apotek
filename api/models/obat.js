const mongoose = require('mongoose')
const mongoose_id_validator = require('mongoose-id-validator')
const mongoose_paginate = require('mongoose-paginate')

const obatSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kategori',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    note: { type: String},
    exp_date: {type: Date, required: true},
    created_at: {
        type: Date, default: Date.now()
    },
    updated_at: {
        type: Date, default: null,
    },
    updated_by: {
        type: String
    }
})

obatSchema.plugin(mongoose_id_validator)
obatSchema.plugin(mongoose_paginate)
module.exports = mongoose.model('Obat', obatSchema)