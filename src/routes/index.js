const express = require('express');

const router = express.Router();

const {
  register,
  login,
  showUsers,
  editUser,
  deleteUser,
} = require('../controllers/user');

const {
  following,
  follower
} = require('../controllers/follow')

const { auth } = require('../middleware/auth')


router.post('/register', register);
router.post('/login', login);
router.get('/users', showUsers);
router.patch('/user/:id', auth, editUser);
router.delete('/user/:id', deleteUser);
router.get('/following/:id', following);
router.get('/follower/:id', follower);

module.exports = router;
