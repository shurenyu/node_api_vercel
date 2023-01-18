const global = require('./global');

exports.verifyToken = (req, res, next) => {
  let token = req.headers["authorization"] && req.headers["authorization"].split(' ')[1];

  if (!token) {
    return res.status(401).send({
      message: "No token provided!"
    });
  }

  const user = Admins.find((item) => item.token === token);

  if (!user) {
    return res.status(401).send({
      message: "Unauthorized!"
    });
  }

  next();
}
