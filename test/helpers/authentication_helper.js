import Promise from 'bluebird';

export function authenticate_user() {
  return new Promise((resolve, reject) => {
    chai.request(server)
      .post("/api/authenticate")
      .send({
        username: "tu1",
        password: "12345"
      })
      .end((err, res) => {
        if(err) reject(err);
        resolve(res.body.token);
      });
  });
};
