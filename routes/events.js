var express = require('express');
const { generateRandomCode } = require('../utils');
var router = express.Router();
const global = require('../utils/global');
const { verifyToken } = require('../utils/middleware');

/* GET events listing. */
router.get('/', verifyToken, function(req, res, next) {
  return res.status(200).json({ result: Events });
});

/* GET event by id. */
router.get('/:id', verifyToken, function(req, res, next) {
  const { id } = req.params;
  const event = Events.find((item) => item.id === id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  return res.status(200).json({ result: event });
});

/* POST add event */
router.post('/', verifyToken, function(req, res, next) {
  const { title, start, end } = req.body;
  const id = generateRandomCode(12);
  const newEvent = {
    id: id,
    title: title || '',
    start: start || '',
    end: end || '',
  };

  Events.push(newEvent);

  return res.status(200).json({ result: newEvent });
});

/* POST update event */
router.post('/:id', verifyToken, function(req, res, next) {
  const { id } = req.params;
  const { title = null, start = null, end = null } = req.body;

  const index = Events.findIndex((item) => item.id === id);

  if (index < 0) {
    return res.status(400).json({ message: 'Event not found.' });
  }

  oldEvent = Events[index];
  newEvent = {
    id: id,
    title: title ?? oldEvent.title,
    start: start ?? oldEvent.start,
    end: end ?? oldEvent.end
  };
  Events[index] = newEvent;

  return res.status(200).json({ result: newEvent });
});

/* DELETE event */
router.delete('/:id', verifyToken, function(req, res, next) {
  const { id } = req.params;

  const index = Events.findIndex((item) => item.id === id);

  if (index < 0) {
    return res.status(400).json({ message: 'Event not found.' });
  }

  Events.splice(index, 1);

  return res.status(200).json({ result: 'Event removed successfully.' });
});

module.exports = router;
