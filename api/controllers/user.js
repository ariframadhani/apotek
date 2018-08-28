const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.collection = (req, res, next) => {
    User.find()
    .select('date isOwner name username address birthdate phone _id')
    .exec()
    .then(data => {
        res.status(200).json({
            info: 'User Collection',
            data: data
        })
    })
    .catch(err => {
        console.log(err)
    })
}

// sign up / register
exports.store = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err,hash) => {
        if(err){
            return res.status(500).json({error:err})
        }else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                username: req.body.username,
                password: hash,
                address: req.body.address,
                birthdate: req.body.birthdate,
                phone: req.body.phone,
                isOwner: req.body.isOwner
            })

            user.save()
            .then(data => {
                console.log(data)
                res.status(200).json({
                    message: 'User stored successfuly',
                    data: data
                })
            })
            .catch (err => {
                console.log(err)
                res.status(500).json({error: err})
            })
        }
    })
}

exports.detail = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
    .select('date isOwner name username address birthdate phone _id')
    .exec()
    .then(data => {
        res.status(200).json({
            data:data
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
        console.log(err)
    })
}

exports.patch = (req, res, next) => {
    const id = req.params.id
    const updateOptions = {}
    for (const ops of req.body){
        updateOptions[ops.propName] = ops.value
    }
    Product.update({_id: id}, {$set: updateOptions})
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
    User.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            mesasge: 'User deleted',
            result: result
        })
        console.log(result)
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
        console.log(err)
    })
}

exports.destroy = (req,res,next) => {
    User.remove({})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "All user data collection has been removed"
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.login = (req, res, next) => {
    User.find({username: req.body.username})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                console.log(err)
                res.status(401).json({
                    message: 'Unauthorized'
                })
            }
            if(result){
                const token = jwt.sign({
                    name: user[0].name,
                    username: user[0].username,
                    id: user[0].id,
                    isOwner: user[0].isOwner
                }, process.env.JWT_KEY, {
                    expiresIn: "24h"
                })

                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token,
                    user: {
                        id: user[0]._id,
                        name: user[0].name,
                        username: user[0].username
                    }
                })
            }            
            res.status(401).json({
                message: 'Unauthorized'
            })
        })
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
}