const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const KategoriController = require('../controllers/kategori')

router.get('/', auth, KategoriController.collection)
router.post('/', auth, KategoriController.store)
router.get('/:id', auth, KategoriController.detail)
router.patch('/:id', auth, KategoriController.patch)
router.delete('/:id', auth, KategoriController.delete)
router.post('/destroy', auth, KategoriController.destroy)
router.get('/valid/:name', auth, KategoriController.existName)

module.exports = router