import User from '../models/user.js';

export function postUser(req, res) {
  new User({
    username: req.body.username,
    password: req.body.password
  })
  .save()
  .then(user => {
    res.status(200);
    res.json({success: true, user: user});
  })
  .catch(err => {
    res.json({success: false, errors: err});
  });
}
