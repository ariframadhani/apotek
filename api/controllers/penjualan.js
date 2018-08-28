const mongoose = require('mongoose')
const Penjualan = require('../models/penjualan')
const Barang = require('../models/obat')

exports.collection = (req, res, next) => {
    let limit = isNaN(req.query.limit) ? 999999 : parseInt(req.query.limit)
    let page = isNaN(req.query.page) ? 1 : parseInt(req.query.page)

    let option = {
        populate: { path: 'user_id', select: 'name username' },
        limit: limit,
        page: page,
        sort: {created_at: -1}
    }

    Penjualan.paginate({}, option)
        .then(resp => {
            let json = {
                info: 'Penjualan Collection',
                data: resp,
                meta: {
                    next: resp.page >= resp.pages ? false : true,
                    next_page: resp.page >= resp.pages ? null : process.env.SERVER + `/api/penjualan?limit=${limit}&page=${page+1}`,
                    prev_page: resp.page === 1 ? null : process.env.SERVER + `/api/penjualan?limit=${limit}&page=${page-1}`,
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
    const penjualan = new Penjualan({
        _id: new mongoose.Types.ObjectId(),
        invoice: req.body.invoice,
        cashier: req.body.cashier,
        total: req.body.total,
        cash: req.body.cash,
        change: req.body.change,
        recipe: req.body.recipe
    })

    penjualan.user_id = req.body.user_id

    penjualan.validate( (err) => {
        if(!err){
            penjualan.save()
            .then(result => {
                res.status(201).json({
                    message: 'Penjualan stored!',
                    data: result
                })

                // <---- TRIGGER TO STOK OBAT ---->
                let kasir = JSON.parse(result.cashier)
                let new_stok 

                for (let i = 0; i < kasir.length; i++) { 
                    
                    Barang.find({code: kasir[i].code})
                    .exec()
                    .then(resp => {
                        new_stok = resp[0].stock - kasir[i].jumlah_beli
                        
                        if(new_stok <= 0){
                            new_stok = 0
                        }

                        Barang.update({code: kasir[i].code}, {stock: new_stok})
                        .exec()
                        .then(result => {
                            res.status(200).json(result)
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
                // <----- END TRIGGER ---->
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
    
    Penjualan.findById(id)
    .populate('user_id', 'name username')
    .exec()
    .then( data => {        
        
        res.status(200).json({
            data: {
                date: data.date,
                total: data.total,
                change: data.change,
                _id: data._id,
                invoice: data.invoice,
                user_id: data.user_id,
                cashier: JSON.parse(data.cashier)
            },
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
    Penjualan.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Penjualan deleted successfuly",
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
    Penjualan.remove({})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Penjualan collection deleted successfuly',
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
        populate: { path: 'user_id', select: 'name username' },
        limit: limit,
        page: page,
        sort: {created_at: -1}
    }

    Penjualan.paginate({$or: [
            {invoice: { $regex: new RegExp("^" + query.toLowerCase() , "i") } }
        ]}, option)
        .then(resp => {
            let json = {
                info: 'Penjualan Collection',
                data: resp,
                meta: {
                    next: resp.page >= resp.pages ? false : true,
                    next_page: resp.page >= resp.pages ? null : process.env.SERVER + `/api/penjualan/search?query=${query}&limit=${limit}&page=${page+1}`,
                    prev_page: resp.page === 1 ? null : process.env.SERVER + `/api/penjualan/search?query=${query}&limit=${limit}&page=${page-1}`,
                    prev: resp.page === 1 ? false : true
                }
            }
            res.status(200).json(json)
            
        })
        .catch(err => {
            console.log(err);  
        })
}