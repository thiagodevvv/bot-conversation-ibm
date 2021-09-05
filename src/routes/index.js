const router = require('express').Router();

const {
    newUser,
    conversationBot,
    getSaldo
} = require('../services/');

router.post('/new', newUser);
router.post('/', conversationBot);
router.get('/saldo/:id', getSaldo);



module.exports = router;