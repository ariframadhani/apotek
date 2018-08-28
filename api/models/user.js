const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: false},
    birthdate: {type: Date, required: false},
    phone: {type: Number, required: false},
    date:{
        created_at: { type:Date, default: Date.now}
    },
    isOwner: {
        type: Boolean, default: true
    }
})

module.exports = mongoose.model('User', userSchema)