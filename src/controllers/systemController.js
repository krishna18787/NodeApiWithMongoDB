const mongoose = require('mongoose');

function hello(req, res) {
  res.json({ message: 'Hello, world!' });
}

function echo(req, res) {
  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'Request body required' });
  }

  res.json({ received: body });
}

function health(req, res) {
  res.json({
    status: 'ok',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
}

module.exports = {
  echo,
  health,
  hello,
};
