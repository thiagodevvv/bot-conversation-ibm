const router = require('express').Router();

const {
    newUser,
    conversationBot,
    getDataUser
} = require('../services/');

router.post('/new', newUser);
router.post('/', conversationBot);
router.post('/user', getDataUser);



module.exports = router;