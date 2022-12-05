const router = require('express').Router();
const { getMyInfo, updateProfile } = require('../controllers/users');
const { validateUpdateProfile } = require('../middlewares/validate');

router.get('/me', getMyInfo);

router.patch('/me', validateUpdateProfile, updateProfile);

module.exports = router;
