const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const constrcController = require('../controllers/constructor')

router.get('/', auth, constrcController.cnstrct)

module.exports = router