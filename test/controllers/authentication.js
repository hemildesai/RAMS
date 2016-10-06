describe("Authentication tests", () => {
  beforeEach(done => {
    knex.seed.run()
      .then(() => {done();});
  });

  it("should authenticate a user if they exist", done => {
    chai.request(server)
      .post("/api/authenticate")
      .send({
        username: "tu1",
        password: "12345"
      })
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.eq(true);
        done();
      });
  });

  it("should not authenticate a user that does not exist", done => {
    chai.request(server)
      .post("/api/authenticate")
      .send({
        username: "tu1dasdsa",
        password: "12345"
      })
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.error).to.eq("User not found");
        expect(res.body.success).to.eq(false);
        done();
      });
  });
})
