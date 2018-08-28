const mongoose = require('mongoose')
const Pembelian = require('../models/pembelian')

exports.collection = (req, res, next) => {
    let limit = isNaN(req.query.limit) ? 999999 : parseInt(req.query.limit)
    let page = isNaN(req.query.page) ? 1 : parseInt(req.query.page)
    
    let option = {
        populate: [
            {
                path: 'user_id',
                select: 'name username'
            },
            {
                path: 'category_id',
                select: 'name'
            }
        ],
        limit: limit,
        page: page,
        sort: {created_at: -1}
    }

    Pembelian.paginate({}, option)
        .then(resp => {
            let json = {
                info: 'Pembelian Collection',
                data: resp,
                meta: {
                    next: resp.page >= resp.pages ? false : true,
                    next_page: resp.page >= resp.pages ? null : process.env.SERVER + `/api/pembelian?limit=${limit}&page=${page+1}`,
                    prev_page: resp.page === 1 ? null : process.env.SERVER + `/api/pembelian?limit=${limit}&page=${page-1}`,
                    prev: resp.page === 1 ? false : true
                }
            }

            res.status(200).json(json)
        })
        .catch(err => {
            console.log(err);
        })
}

exports.store = (req, res, next) => {
    const pembelian = new Pembelian({
        _id: new mongoose.Types.ObjectId(),
        invoice: req.body.invoice,
        supplyer: req.body.supplyer,
        name: req.body.name,
        code: req.body.code,
        buy_price: req.body.buy_price,
        sale_price: req.body.sale_price,
        buy_stok: req.body.buy_stok,
        tanggal_pembelian: req.body.tanggal_pembelian,
        outcome: req.body.outcome
    })
    
    pembelian.category_id = req.body.category_id
    pembelian.user_id = req.body.user_id

    pembelian.validate( (err) => {
        if(!err){
            pembelian.save()
            .then(result => {
                res.status(201).json({
                    message: 'Pembelian stored!',
                    data: result
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            })
        }else{            
            console.log(err);
            res.status(500).json({
                error: err
            })
        }
    })
}

exports.detail = (req, res, next) => {
    const id = req.params.id

    if (id === 'search') {
        return next()
    }
    
    Pembelian.findById(id)
    .populate('user_id', 'name username')
    .exec()
    .then( data => {   
        res.status(200).json({
            data: data
        })        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}

exports.delete = (req, res, next) => {
    const id = req.params.id
    Pembelian.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Pembelian deleted successfuly",
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

exports.destroy = (req, res, next) => {
    Pembelian.remove({})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Pembelian collection deleted successfuly',
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
    let limit = isNaN(req.query.limit) ? 999999 : parseInt(req.query.limit)
    let page = isNaN(req.query.page) ? 1 : parseInt(req.query.page)
    let query = req.query.query

    let option = {
        populate: [
            {
                path: 'user_id',
                select: 'name username'
            },
            {
                path: 'category_id',
                select: 'name'
            }
        ],
        limit: limit,
        page: page,
        sort: {created_at: -1}
    }

    Pembelian.paginate({
        $or: [
            { invoice: { $regex: new RegExp("^" + query.toLowerCase() , "i") } }
        ]}, option)
        .then(resp => {
            let json = {
                info: 'Pembelian Collection',
                data: resp,
                meta: {
                    next: resp.page >= resp.pages ? false : true,
                    next_page: resp.page >= resp.pages ? null : process.env.SERVER + `/api/pembelian/search?query=${query}&limit=${limit}&page=${page+1}`,
                    prev_page: resp.page === 1 ? null : process.env.SERVER + `/api/pembelian/search?query=${query}&limit=${limit}&page=${page-1}`,
                    prev: resp.page === 1 ? false : true
                }
            }
            res.status(200).json(json)
        })
        .catch(err => {
            console.log(err);
        })
    
    
}