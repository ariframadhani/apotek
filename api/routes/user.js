const express = require('express')
const router = express.Router()
const owner = require('../middleware/owner')
const auth = require('../middleware/auth')

const UserController = require('../controllers/user')

// router.get('/', auth, UserController.collection)
router.get('/', UserController.collection)
router.post('/', UserController.store)
router.get('/:id', UserController.detail)
router.patch('/:id', UserController.patch)
router.delete('/:id', UserController.delete)
router.post('/destroy', UserController.destroy)

// auth 
router.post('/login', UserController.login)

module.exports = router