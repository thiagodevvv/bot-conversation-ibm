const router = require('express').Router();

const {
    newUser,
    conversationBot
} = require('../services/')

router.post('/new', newUser)
router.post('/', conversationBot)



module.exports = router;