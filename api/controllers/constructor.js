const Constructor = require('../models/constructor')

exports.cnstrct = (req, res, next) => {
    Constructor.find()
    .exec()
    .then(data => {
        res.status(200).json({
            info: 'Connection OK!'
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}