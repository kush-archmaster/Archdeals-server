const express = require('express');
const router = express.Router();
const categoryControls = require('./routeConfig/categoryControls');
const authenticate = require('./middlewares/authenticate');
const adminAuth = require('./middlewares/adminAuth');

router.route('/category')
    .get(categoryControls.getCategories)
    .post(authenticate, adminAuth, categoryControls.createCategory);

    //deleting and updating categories require admin access
router.route('/category/:id')
    .delete(authenticate, adminAuth, categoryControls.deleteCategory)
    .put(authenticate, adminAuth, categoryControls.updateCategory);


module.exports = router;