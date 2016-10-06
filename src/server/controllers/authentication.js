import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import config from '../config';

export function authenticateUser(req, res) {
  User.verifyUser(req.body.username, req.body.password)
    .then(user => {
      const token = jwt.sign(user, config.secret, {
        expiresIn: 10080
      });

      res.json({success: true, token: token});
    })
    .catch(User.NotFoundError, () => {
      res.json({success: false, error: "User not found"})
    })
    .catch(err => {
      res.json({success: false, error: "Error in authentication"});
    });
}
