const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const PembelianController = require('../controllers/pembelian')

router.get('/', auth, PembelianController.collection)
router.post('/', auth, PembelianController.store)
router.get('/:id', auth, PembelianController.detail)
router.delete('/:id', auth, PembelianController.delete)
router.post('/destroy', auth, PembelianController.destroy)
router.get('/search', auth, PembelianController.search)

module.exports = router