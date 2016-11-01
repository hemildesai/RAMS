var jwt_token;
import Collection from '../../src/server/models/collection.js';
import {authenticate_user} from '../helpers/authentication_helper.js';

describe("Collection controller tests", () => {

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

  describe("postCollection", () => {
    it("should create a Collection", (done)  => {
      chai.request(server)
        .post("/api/collections")
        .set("x-access-token", jwt_token)
        .send({
          title: "timepass",
          is_private: true
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.collection).to.not.be.undefined;
          expect(res.body.collection.title).to.eq("timepass");
          expect(res.body.collection.is_private).to.eq(true);
          Collection.count()
            .then(count => {
              expect(count).to.equal(5);
              done();
            });
        });
    });
  });

  describe("getCollections", () => {
    it("should get all collections that are valid for the user", (done)  => {
      chai.request(server)
        .get("/api/collections")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.collections.length).to.eq(2);

          res.body.collections.forEach(c => {
            expect(c.title).to.include("test");
            expect(c.user_id).to.eq(1);
          });

          done();
        });
    });
  });

  describe("getCollection", () => {
    it("should get a collection if its valid", (done)  => {
      chai.request(server)
        .get("/api/collections/1")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.collection).to.not.be.undefined;
          expect(res.body.collection.title).to.eq("test tech");
          done();
        });
    });

    it("should not get a collection if its not valid", (done)  => {
      chai.request(server)
        .get("/api/collections/3")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(false);
          expect(res.body.collection).to.be.undefined;
          done();
        });
    });

    it("should get a user's private collection", (done)  => {
      chai.request(server)
        .get("/api/collections/4")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.collection).to.not.be.undefined;
          done();
        });
    });
  });

  describe("putCollection", () => {
    it("should edit a user's collection", (done)  => {
      chai.request(server)
        .put("/api/collections/1")
        .set("x-access-token", jwt_token)
        .send({
          title: "gooogle",
          is_private: true
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.collection).to.not.be.undefined;
          expect(res.body.collection.title).to.eq("gooogle");
          expect(res.body.collection.user_id).to.eq(1);
          expect(res.body.collection.is_private).to.eq(true);
          done();
        });
    });

    it("should not edit another user's collection", (done)  => {
      chai.request(server)
        .put("/api/collections/3")
        .set("x-access-token", jwt_token)
        .send({
          name: "gooogle",
          is_private: false
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(false);
          expect(res.body.collection).to.be.undefined;
          expect(res.body.errors).to.eq("Collection does not belong to you or does not exist");
          done();
        });
    });
  });

  describe("deleteCollection", () => {
    it("should delete a user's collection", (done)  => {
      chai.request(server)
        .delete("/api/collections/1")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.message).to.eq("Collection 1 destroyed");
          Collection.count()
            .then(count => {
              expect(count).to.equal(3);
              done();
            });
        });
    });

    it("should not delete another user's collection", (done)  => {
      chai.request(server)
        .delete("/api/collections/3")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(false);
          expect(res.body.collection).to.be.undefined;
          expect(res.body.errors.message).to.not.be.undefined;
          expect(res.body.errors.message).to.eq("No rows deleted");
          done();
        });
    });
  });

  describe("getPrivateCollections", () => {
    it("should get a user's private collections", (done)  => {
      chai.request(server)
        .get("/api/collections/private")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.collections.length).to.eq(1);

          res.body.collections.forEach(r => {
            expect(r.is_private).to.eq(1);
            expect(r.user_id).to.eq(1);
          });

          done();
        });
    });
  });

  describe("removeResourceFromCollection", () => {
    it("should remove the specified resource from the collection", done => {
      chai.request(server)
        .post("/api/resources")
        .set("x-access-token", jwt_token)
        .send({
          name: "google",
          link: "google.com",
          is_private: false,
          collection_id: 1
        })
        .end((err, res) => {
          chai.request(server)
            .post("/api/collections/1/remove")
            .set("x-access-token", jwt_token)
            .send({
              resource_id: res.body.resource.id
            })
            .end((err, res) => {
              expect(res.status).to.eq(200);
              expect(res.body.success).to.eq(true);
              Collection
                .where({user_id: 1, id: 1})
                .fetch({require: true, withRelated: ["resources"]})
                .then((collection) => {
                  // expect(collection.toJSON().resources.length).to.eq(154);
                  done();
                });
            });
        });
    });
  });

  describe("addResourceToCollection", () => {
    it("should remove the specified resource from the collection", done => {
      chai.request(server)
        .post("/api/resources")
        .set("x-access-token", jwt_token)
        .send({
          name: "google",
          link: "google.com",
          is_private: false
        })
        .end((err, res) => {
          chai.request(server)
            .post("/api/collections/1/add")
            .set("x-access-token", jwt_token)
            .send({
              resource_id: res.body.resource.id
            })
            .end((err, res) => {
              expect(res.status).to.eq(200);
              expect(res.body.success).to.eq(true);
              Collection
                .where({user_id: 1, id: 1})
                .fetch({require: true, withRelated: ["resources"]})
                .then((collection) => {
                  // expect(collection.toJSON().resources.length).to.eq(155);
                  done();
                });
            });
        });
    });
  });
});
