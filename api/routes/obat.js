const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const ObatController = require('../controllers/obat')

router.get('/', auth,ObatController.collection)
router.post('/', auth, ObatController.store)
router.get('/:id', auth, ObatController.detail)
router.patch('/:id', auth, ObatController.patch)
router.delete('/:id', auth, ObatController.delete)
router.post('/destroy', auth, ObatController.destroy)
router.get('/valid/:code', auth, ObatController.existCode)
router.get('/search', auth, ObatController.search)

module.exports = router