
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
  });
});
