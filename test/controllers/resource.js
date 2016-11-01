var jwt_token;
import Resource from '../../src/server/models/resource.js';
import Collection from '../../src/server/models/collection.js';
import {authenticate_user} from '../helpers/authentication_helper.js';

describe("Resource controller tests", () => {

  beforeEach(done => {
    knex.seed.run()
      .then(() => {
        authenticate_user()
          .then((token) => {
            jwt_token = token;
            done();
          });
      });
  });

  describe("postResource", () => {
    it("should create a Resource", (done)  => {
      chai.request(server)
        .post("/api/resources")
        .set("x-access-token", jwt_token)
        .send({
          name: "google",
          link: "google.com",
          is_private: true
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.resource).to.not.be.undefined;
          expect(res.body.resource.name).to.eq("google");
          expect(res.body.resource.link).to.eq("google.com");
          expect(res.body.resource.is_private).to.eq(true);
          Resource.count()
            .then(count => {
              expect(count).to.equal(599);
              done();
            });
        });
    });

    it("should create a Resource and add it to collection if collection id is mentioned", (done)  => {
      chai.request(server)
        .post("/api/resources")
        .set("x-access-token", jwt_token)
        .send({
          name: "google",
          link: "google.com",
          is_private: false,
          collection_id: 3
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.resource).to.not.be.undefined;
          expect(res.body.resource.name).to.eq("google");
          expect(res.body.resource.link).to.eq("google.com");
          expect(res.body.resource.is_private).to.eq(false);
          Resource.count()
            .then(count => {
              expect(count).to.equal(599);
              Collection
                .where({id: 3})
                .fetch({require: true, withRelated: ["resources"]})
                .then((collection) => {
                  expect(collection.toJSON().resources.length).to.eq(1);
                  done();
                });
            });
        });
    });
  });

  describe("getResources", () => {
    it("should get all  resources that are not private", (done)  => {
      chai.request(server)
        .get("/api/resources")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.resources).to.not.be.undefined;
          expect(res.body.resources.length).to.eq(539);
          done();
        });
    });
  });

  describe("getResource", () => {
    it("should get a resource if its valid", (done)  => {
      chai.request(server)
        .get("/api/resources/1")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.resource).to.not.be.undefined;
          expect(res.body.resource.name).to.eq("Abstract State Machines");
          done();
        });
    });

    it("should not get a resource if its not valid", (done)  => {
      chai.request(server)
        .get("/api/resources/600")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(false);
          expect(res.body.resource).to.be.undefined;
          done();
        });
    });

    it("should get a user's private resource", (done)  => {
      chai.request(server)
        .get("/api/resources/4")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.resource).to.not.be.undefined;
          done();
        });
    });
  });

  describe("putResource", () => {
    it("should edit a user's resource", (done)  => {
      chai.request(server)
        .put("/api/resources/1")
        .set("x-access-token", jwt_token)
        .send({
          name: "gooogle",
          is_private: true
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.resource).to.not.be.undefined;
          done();
        });
    });

    it("should not edit another user's resource", (done)  => {
      chai.request(server)
        .put("/api/resources/3")
        .set("x-access-token", jwt_token)
        .send({
          name: "gooogle",
          is_private: false
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(false);
          expect(res.body.resource).to.be.undefined;
          expect(res.body.errors).to.eq("Resource does not belong to you or does not exist");
          done();
        });
    });
  });

  describe("deleteResource", () => {
    it("should delete a user's resource", (done)  => {
      chai.request(server)
        .delete("/api/resources/1")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.message).to.eq("Resource 1 destroyed");
          Resource.count()
            .then(count => {
              expect(count).to.equal(597);
              done();
            });
        });
    });

    it("should not delete another user's resource", (done)  => {
      chai.request(server)
        .delete("/api/resources/3")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(false);
          expect(res.body.resource).to.be.undefined;
          expect(res.body.errors.message).to.not.be.undefined;
          expect(res.body.errors.message).to.eq("No rows deleted");
          done();
        });
    });
  });

  describe("getPrivateResources", () => {
    it("should get a user's private resources", (done)  => {
      chai.request(server)
        .get("/api/resources/private")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.resources.length).to.eq(40);

          res.body.resources.forEach(r => {
            expect(r.is_private).to.eq(1);
            expect(r.user_id).to.eq(1);
          });

          done();
        });
    });
  });
});
