const mongoose = require('mongoose')
const Obat = require('../models/obat')
const Kategori = require('../models/kategori')
const moment = require('moment')
const jwt = require('jsonwebtoken')

exports.collection = (req, res, next) => {
    let limit = isNaN(req.query.limit) ? 999999 : parseInt(req.query.limit)
    let page = isNaN(req.query.page) ? 1 : parseInt(req.query.page)
    
    let option = {
        select: 'created_at _id name price stock note category_id user_id exp_date code updated_by updated_at',
        populate: [
            {
                path: 'user_id',
                select: 'name username'
            },
            {
                path: 'category_id',
                select: 'name note'
            },
        ],
        limit: limit,
        page: page,
        sort: {created_at: -1},
    }
    
    Obat.paginate({}, option) 
    .then(resp => {
        let json = {
            info: 'Obat Collection',
            data: resp,
            meta: {
                next: resp.page >= resp.pages ? false : true,
                next_page: resp.page >= resp.pages ? null : process.env.SERVER + `/api/obat?limit=${limit}&page=${page+1}`,
                prev_page: resp.page === 1 ? null : process.env.SERVER + `/api/obat?limit=${limit}&page=${page-1}`,
                prev: resp.page === 1 ? false : true
            }
        }
        res.status(200).json(json)
    })
    .catch(err => {
        console.log(err)
    })
}

exports.store = (req, res, next) => {
    const date = moment(req.body.exp_date, ["YYYY", moment.ISO_8601]);
    const obat = new Obat({
        _id: new mongoose.Types.ObjectId(),
        code: req.body.code,
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        note: req.body.note,
        exp_date: date,
        created_at: moment().format()
    })

    obat.category_id = req.body.category_id
    obat.user_id = req.body.user_id

    obat.validate( (err) => {
        if(!err){
            obat.save()
            .then( data => {
                console.log('STORE : '+data);
                res.status(201).json({
                    message: 'Obat stored!',
                    data: data
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error:err})
            })
        }else{
            res.status(500).json({
                error: err
            })
        }       
        
    })
}

exports.detail = (req, res, next) => {
    if (req.params.id === 'search') {
        return next()
    }

    Obat.findById(req.params.id)
    .select('date _id name price stock note category_id user_id')
    .populate('user_id', 'name username')
    .populate('category_id', 'name note')
    .exec()
    .then(data => {
        res.status(200).json({
            data: data
        })
    })
    .catch(err => {
        console.log(err + " from obat controller @detail");
        res.status(500).json({error:err})
    })
}

exports.existCode = (req, res, next) => {  
    Obat.find({code: req.params.code})
    .exec()
    .then(data => {  
        res.status(200).json({ data: data})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err})
    })
    
}

exports.patch = (req, res, next) => {
    const id = req.params.id
    
    req.body.update_at = Date.now()

    Obat.update({_id: id}, req.body)
    .then(data => {
        console.log('UPDATE: '+data);
        res.status(200).json(data)
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })
}

exports.delete = (req, res, next) => {
    const id = req.params.id
    Obat.remove({_id: id})
    .exec()
    .then( data => {
        res.status(200).json({
            message: 'Obat deleted successfuly'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
}

exports.destroy = (req, res, next) => {
    Obat.remove({})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Obat collection deleted successfuly',
            result: result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
        
    })
}

exports.search = (req, res, next) => {
    let query = req.query.query
    let limit = isNaN(req.query.limit) ? 999999 : parseInt(req.query.limit)
    let page = isNaN(req.query.page) ? 1 : parseInt(req.query.page)

    let option = {
        select: 'created_at _id name price stock note category_id user_id exp_date code updated_by updated_at',
        populate: [
            {
                path: 'user_id',
                select: 'name username'
            },
            {
                path: 'category_id',
                select: 'name note'
            },
        ],
        limit: limit,
        page: page,
        sort: {created_at: -1},
    }
    
    Obat.paginate({
        $or: [
            {code: { $regex: new RegExp("^" + query.toLowerCase() , "i") } },
            {name: { $regex: new RegExp("^" + query.toLowerCase() , "i") } },
        ]}, option) 
    .then(resp => {
        let json = {
            info: 'Obat Collection',
            data: resp,
            meta: {
                next: resp.page >= resp.pages ? false : true,
                next_page: resp.page >= resp.pages ? null : process.env.SERVER + `/api/obat/search?query=${query}&limit=${limit}&page=${page+1}`,
                prev_page: resp.page === 1 ? null : process.env.SERVER + `/api/obat/search?query=${query}&limit=${limit}&page=${page-1}`,
                prev: resp.page === 1 ? false : true
            }
        }

        res.status(200).json(json)
        
    })
    .catch(err => {
        console.log(err)
    })
}