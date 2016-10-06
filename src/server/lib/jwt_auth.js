import {Strategy, ExtractJwt} from 'passport-jwt';
import User from '../models/user.js';
import config from '../config';

export default function(passport) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromHeader("x-access-token"),
    secretOrKey: config.secret
  };

  passport.use(new Strategy(opts, (jwt_payload, done) => {
    User
      .where({id: jwt_payload.id})
      .fetch()
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, false);
      });
  }));
}
