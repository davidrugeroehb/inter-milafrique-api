const express = require('express');
const router = express.Router();
const nieuwsController = require('../controllers/nieuwsController');

router.get('/', nieuwsController.getAllNieuws);
router.get('/:id', nieuwsController.getNieuwsById);
router.post('/', nieuwsController.createNieuws);
router.put('/:id', nieuwsController.updateNieuws);
router.delete('/:id', nieuwsController.deleteNieuws);

module.exports = router;