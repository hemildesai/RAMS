process.NODE_ENV = "test";
import User from '../../src/server/models/user';

describe("User model tests", () => {
  beforeEach(done => {
    knex.seed.run()
      .then(() => {
        done();
      });
  });

  it("ensures that the minimum length of a password is 5", done => {
    new User({
      username: "abcd",
      password: "1234"
    })
    .save()
    .catch(err => {})
    .finally(() => {
      User.count()
        .then(count => {
          expect(count).to.equal(3);
          done();
        });
    });
  });

  it("ensures that the password is hashed before saving", done => {
    new User({
      username: "abcd",
      password: "12345"
    })
    .save()
    .then(user => {
     // console.log(user.attributes.password);
      expect(user.attributes.password).to.not.equal("12345");
      done();
    })
    .catch(err => {console.log(err); });
  });
})
