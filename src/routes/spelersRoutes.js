const express = require('express');
const router = express.Router();
const spelersController = require('../controllers/spelersController');

router.get('/', spelersController.getAllSpelers);
router.get('/:id', spelersController.getSpelerById);
router.post('/', spelersController.createSpeler);
router.put('/:id', spelersController.updateSpeler);
router.delete('/:id', spelersController.deleteSpeler);

module.exports = router;