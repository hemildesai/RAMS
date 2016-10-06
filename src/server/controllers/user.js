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

export function changeUserPassword(req, res) {
  User.verifyUser(req.user.attributes.username, req.body.old_password)
    .then(user => {
      user
        .save({
          password: req.body.new_password
        })
        .then(user => {
          res.json({success: true, message: "Password changed"});
        })
        .catch(err => {
          res.json({success: false, message: "Password change failed"});
        });
    })
    .catch(User.NotFoundError, () => {
      res.json({success: false, error: "User not found"});
    })
    .catch(err => {
      res.json({success: false, error: "Error in changing password"});
    });
}
