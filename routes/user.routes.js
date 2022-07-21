const Router = require('express');
const router = new Router();
const userController = require('../controllers/user.controller');

router.param('id', userController.checkUserPassword);

router.get('/info/:id', userController.getUser);
router.get('/info/:id/:account_id', userController.getAccountInfo);
router.put('/update_balance/:id', userController.updateBalance);


module.exports = router;
