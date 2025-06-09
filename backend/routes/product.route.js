const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middlewares/multer');
const isAdmin = require('../middlewares/isAdmin');

// CRUD routes
router.post('/', isAdmin, upload.array('images', 4), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', isAdmin, productController.updateProduct);
router.delete('/:id', isAdmin, productController.deleteProduct);

module.exports = router;
