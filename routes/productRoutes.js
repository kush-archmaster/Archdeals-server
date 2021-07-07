const express = require('express');
const router = express.Router();
const productControl = require('./routeConfig/productControls');
const authenticate = require('./middlewares/authenticate');
const adminAuth = require('./middlewares/adminAuth');

router.route('/products')
    .get(productControl.getProducts)
    .post(authenticate, adminAuth, productControl.createProduct);

//deleting and updating categories require admin access
router.route('/products/:id')
    .delete(authenticate, adminAuth, productControl.deleteProduct)
    .put(authenticate, adminAuth, productControl.updateProduct);



module.exports = router;
