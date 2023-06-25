const express = require('express');

const chatControllers = require('../controllers/chat');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/recent-chats/:userId', isAuth, chatControllers.getRecentChats);

router.post('/send-chat', isAuth, chatControllers.sendChat);

router.post('/get-chats', isAuth, chatControllers.getChats);

router.post('/create-recent-chats', isAuth, chatControllers.createRecentChats);

router.post('/create-chat', isAuth, chatControllers.createChat);

module.exports = router;