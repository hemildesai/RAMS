import {authenticate_user} from '../helpers/authentication_helper.js';

describe("User controller tests", () => {

  beforeEach(done => {
    knex.seed.run()
      .then(() => {
        done();
      });
  });

  describe("postUser", () => {
    it("should create a user", (done)  => {
      chai.request(server)
        .post("/api/users")
        .send({
          username: "test",
          password: "12345"
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.equal(true);
          expect(res.body.success).to.eq(true);
          expect(res.body.user).to.not.be.undefined;
          expect(res.body.user.username).to.eq("test");
          done();
        });
    });

    it("should change a users password if old password is correct", (done) => {
      authenticate_user()
        .then((token) => {
          chai.request(server)
            .post("/api/users/change")
            .set("x-access-token", token)
            .send({
              old_password: "12345",
              new_password: "123456"
            })
            .end((err, res) =>  {
              res.should.have.status(200);
              expect(res.body.success).to.eq(true);
              chai.request(server)
                .post("/api/authenticate")
                .send({
                  username: "tu1",
                  password: "123456"
                })
                .end((err, res) => {
                  expect(res.status).to.eq(200);
                  expect(res.body.success).to.eq(true);
                  done();
                });
            });
        });
    });

    it("should not change a users password if old password is incorrect", (done) => {
      authenticate_user()
        .then((token) => {
          chai.request(server)
            .post("/api/users/change")
            .set("x-access-token", token)
            .send({
              old_password: "1234565",
              new_password: "123456"
            })
            .end((err, res) =>  {
              res.should.have.status(200);
              expect(res.body.success).to.eq(false);
              done();
            });
        });
    });

    it("should not change a users password if user is not signed in", (done) => {
      chai.request(server)
        .post("/api/users/change")
        .send({
          old_password: "1234565",
          new_password: "123456"
        })
        .end((err, res) =>  {
          res.should.have.status(401);
          done();
        });
    });
  });
});
