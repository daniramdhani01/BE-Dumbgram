const express = require('express');

const router = express.Router();

const { auth } = require('../middleware/auth')
const { uploadFile } = require('../middleware/uploadFile')
const {
  register,
  login,
  showUsers,
  editUser,
  deleteUser,
  following,
  follower,
  addFollow,
  unfollow,
} = require('../controllers/user');

const {
  addImage,
  feedFollowing,
  Feeds,
  addLike,
  comments
} = require('../controllers/feeds')

const {
  addMessage,
  messages
} = require('../controllers/messages')

router.post('/register', register);
router.post('/login', login);

router.get('/users', showUsers);
router.patch('/user/:id', auth, editUser);
router.delete('/user/:id', deleteUser);

// follow
router.get('/following/:id', following); //show following 
router.get('/follower/:id', follower); // show follower
router.post('/follow/:id', auth, addFollow);
router.post('/unfollow/:id', auth, unfollow);

// feeds
router.post('/feed', auth, uploadFile('image'), addImage);
router.get('/feed/', auth, feedFollowing)
router.get('/feeds', Feeds) //its mean explore
router.post('/like', auth, addLike)
router.get('/comments/:id', auth, comments)

// message
router.post('/message/:id_user_send_to', auth, addMessage)
router.get('/message-user/:id_user_send_to', auth, messages)

module.exports = router;
