var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const global = require('../utils/global');

const generateToken = (user) => {
  const now = new Date().getTime();
  const initData = `${user.email}_${now}`;
  const token = crypto.createHash('sha256').update(initData).digest('hex');

  // Register token
  const index = Admins.findIndex((item) => item.email === user.email);
  if (index > -1) {
    Admins[index] = {
      email: user.email,
      password: user.password,
      token: token
    }
  }

  return token;
}

router.post('/login', function(req, res, next) {
  const {email, password} = req.body;

  const user = Admins.find((item) => item.email === email);

  if (!user) {
    return res.status(404).json({message: 'Email not found.'});
  }

  if (user.password !== password) {
    return res.status(400).json({message: 'Password is wrong.'});
  }

  const token = generateToken(user);

  res.status(200).json({token: token});
});

router.post('/sign-up', function(req, res, next) {
  const { email, password } = req.body;

  const user = Admins.find((item) => item.email === email);

  if (user) {
    return res.status(400).json({message: 'Email already exists.'});
  }

  const newUser = {
    email: email,
    password: password
  };

  Admins.push(newUser);

  const token = generateToken(newUser);

  res.status(200).json({token: token});
});

router.post('/delete', function(req, res, next) {
  const { email = null } = req.body;

  if (!email) {
    Admins = [];
    return res.status(200).json('All admins removed successfully.');    
  }

  const user = Admins.find((item) => item.email === email);

  if (!user) {
    return res.status(400).json({message: 'Email not found.'});
  }

  Admins = Admins.filter((item) => item.email !== email);

  res.status(200).json('Removed successfully.');
});

router.get('/admins', function(req, res, next) {
  res.status(200).json({ result: Admins });
});

module.exports = router;
