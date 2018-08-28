const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    try{
        const token = req.headers.authorization.split(" ")[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decode

        return req.userData.isOwner ? next() : res.status(401).json({
            message: 'You dont have permission!'
        })
    }catch(e){
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}