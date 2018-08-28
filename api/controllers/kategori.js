const mongoose = require('mongoose')
const Kategori = require('../models/kategori')
const User = require('../models/user')
const Obat = require('../models/obat')

exports.collection = (req, res, next) => {
    Kategori.find()
    .select('date _id name note user_id')
    .populate('user_id', 'name username')
    .exec()
    .then(data => {
        res.status(200).json({
            info: 'Kategori Collection',
            data: data
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.store = (req, res, next) => {
    const kategori = new Kategori({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        note: req.body.note,
    })

    kategori.user_id = req.body.user_id

    kategori.validate( (err) => {
        if(!err){
            kategori.save()
            .then( result => {
                res.status(200).json({
                    message: 'Kategori stored',
                    data: result
                })
            })
        }else{
            res.status(500).json({                
                error: err
            })
        }
    })
    
}

exports.detail = (req, res, next) => {
    const id = req.params.id
    Kategori.findById(id)
    .select("name user_id _id date")
    .populate('user_id')
    .exec()
    .then( data => {
        console.log(data)
        res.status(200).json({
            name: data.name,
            user_id: data.user_id,
            date: {
                created_at: data.date.created_at
            },
            _id: data._id 

        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err})
    })
}

exports.patch = (req, res, next) => {
    const id = req.params.id
    Kategori.update({_id: id}, req.body)
    .exec()
    .then(data => {
        console.log(data)
        res.status(200).json(data)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.delete = (req, res, next) => {
    const id = req.params.id
    
    Obat.findOne({category_id: id})
    .exec()
    .then(result =>{      
        if(!result){
            Kategori.remove( {_id: id} )
            .exec()
            .then(resp => {
                res.status(200).json({
                    message: 'Kategori removed',
                    result: resp
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({error:err})
            })
        }else{
            res.status(422).json({error: err});
        }
    })
    .catch(err => {
        res.status(422).json({error: err});
    })
}

exports.destroy = (req, res, next) => {
    Kategori.remove({})
    .then( result => {
        res.status(200).json({
            message: 'Category collection has been removed'
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.existName = (req, res, next) => {
    Kategori.find({name: req.params.name})
    .exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err})
    })
}