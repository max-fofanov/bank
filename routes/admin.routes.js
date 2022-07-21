const Router = require('express');
const router = new Router();
const adminController = require('../controllers/admin.controler');

router.use(adminController.checkAdminPassword);

router.post('/create_user', adminController.createUser);
router.post('/create_account', adminController.createAccount);



module.exports = router;