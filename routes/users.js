var express = require('express');
const { generateRandomCode } = require('../utils');
var router = express.Router();
const global = require('../utils/global');
const { verifyToken } = require('../utils/middleware');

/* GET users listing. */
router.get('/', verifyToken, function(req, res, next) {
  return res.status(200).json({ result: Users });
});

/* GET user by id. */
router.get('/:id', verifyToken, function(req, res, next) {
  const { id } = req.params;
  const user = Users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.status(200).json({ result: user });
});

/* POST add user */
router.post('/', verifyToken, function(req, res, next) {
  const { name, email, age } = req.body;
  const id = generateRandomCode(12);
  const newUser = {
    id: id,
    name: name || '',
    email: email || '',
    age: age || 0
  };

  Users.push(newUser);

  return res.status(200).json({ result: newUser });
});

/* POST update user */
router.post('/:id', verifyToken, function(req, res, next) {
  const { id } = req.params;
  const { name = null, email = null, age = null } = req.body;

  const index = Users.findIndex((item) => item.id === id);

  if (index < 0) {
    return res.status(400).json({ message: 'User not found.' });
  }

  user = Users[index];
  userUpdated = {
    id: id,
    name: name ?? user.name,
    email: email ?? user.email,
    age: age ?? user.age
  };
  Users[index] = userUpdated;

  return res.status(200).json({ result: userUpdated });
});

/* DELETE user */
router.delete('/:id', verifyToken, function(req, res, next) {
  const { id } = req.params;

  const index = Users.findIndex((item) => item.id === id);

  if (index < 0) {
    return res.status(400).json({ message: 'User not found.' });
  }

  Users.splice(index, 1);

  return res.status(200).json({ result: 'User removed successfully.' });
});

module.exports = router;
