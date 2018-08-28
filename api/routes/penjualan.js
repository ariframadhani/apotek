const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const PenjualanController = require('../controllers/penjualan')

router.get('/', auth, PenjualanController.collection)
router.post('/', auth, PenjualanController.store)
router.get('/:id', auth, PenjualanController.detail)
router.delete('/:id', auth, PenjualanController.delete)
router.post('/destroy', auth, PenjualanController.destroy)
router.get('/search', auth, PenjualanController.search)

module.exports = router