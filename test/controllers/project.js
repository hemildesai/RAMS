var jwt_token;
import Project from '../../src/server/models/project.js';
import {authenticate_user} from '../helpers/authentication_helper.js';

describe("Project controller tests", () => {

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

  describe("postProject", () => {
    it("should create a Project", (done)  => {
      chai.request(server)
        .post("/api/projects")
        .set("x-access-token", jwt_token)
        .send({
          title: "timepass",
          is_private: true
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.project).to.not.be.undefined;
          expect(res.body.project.title).to.eq("timepass");
          expect(res.body.project.is_private).to.eq(true);
          Project.count()
            .then(count => {
              expect(count).to.equal(5);
              done();
            });
        });
    });
  });

  describe("getprojects", () => {
    it("should get all projects that are valid for the user", (done)  => {
      chai.request(server)
        .get("/api/projects")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.projects.length).to.eq(1);

          res.body.projects.forEach(c => {
            // expect(c.title).to.include("test");
            expect(c.user_id).to.eq(1);
          });

          done();
        });
    });
  });

  describe("getProject", () => {
    it("should get a project if its valid", (done)  => {
      chai.request(server)
        .get("/api/projects/1")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.project).to.not.be.undefined;
          expect(res.body.project.title).to.eq("project1");
          done();
        });
    });

    it("should not get a project if it's not valid", (done)  => {
      chai.request(server)
        .get("/api/projects/3")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(false);
          expect(res.body.project).to.be.undefined;
          done();
        });
    });

    it("should get a user's private project", (done)  => {
      chai.request(server)
        .get("/api/projects/4")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.project).to.not.be.undefined;
          done();
        });
    });
  });

  describe("putProject", () => {
    it("should edit a user's project", (done)  => {
      chai.request(server)
        .put("/api/projects/1")
        .set("x-access-token", jwt_token)
        .send({
          title: "gooogle",
          is_private: true
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.project).to.not.be.undefined;
          expect(res.body.project.title).to.eq("gooogle");
          expect(res.body.project.user_id).to.eq(1);
          expect(res.body.project.is_private).to.eq(true);
          done();
        });
    });

    it("should not edit another user's project", (done)  => {
      chai.request(server)
        .put("/api/projects/3")
        .set("x-access-token", jwt_token)
        .send({
          name: "gooogle",
          is_private: false
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(false);
          expect(res.body.project).to.be.undefined;
          expect(res.body.errors).to.eq("Project does not belong to you or does not exist");
          done();
        });
    });
  });

  describe("deleteProject", () => {
    it("should delete a user's project", (done)  => {
      chai.request(server)
        .delete("/api/projects/1")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.message).to.eq("Project 1 destroyed");
          Project.count()
            .then(count => {
              expect(count).to.equal(3);
              done();
            });
        });
    });

    it("should not delete another user's project", (done)  => {
      chai.request(server)
        .delete("/api/projects/3")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(false);
          expect(res.body.project).to.be.undefined;
          expect(res.body.errors.message).to.not.be.undefined;
          expect(res.body.errors.message).to.eq("No rows deleted");
          done();
        });
    });
  });

  describe("getPrivateProjects", () => {
    it("should get a user's private projects", (done)  => {
      chai.request(server)
        .get("/api/projects/private")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.projects.length).to.eq(2);

          res.body.projects.forEach(r => {
            expect(r.is_private).to.eq(1);
            expect(r.user_id).to.eq(1);
          });

          done();
        });
    });
  });

  describe("removeCollectionFromProject", () => {
    it("should remove the specified collection from the project", done => {
      chai.request(server)
        .post("/api/collections")
        .set("x-access-token", jwt_token)
        .send({
          title: "google",
          is_private: false,
          project_id: 1
        })
        .end((err, res) => {
          chai.request(server)
            .post("/api/projects/1/remove")
            .set("x-access-token", jwt_token)
            .send({
              collection_id: res.body.collection.id
            })
            .end((err, res) => {
              expect(res.status).to.eq(200);
              expect(res.body.success).to.eq(true);
              Project
                .where({user_id: 1, id: 1})
                .fetch({require: true, withRelated: ["collections"]})
                .then((project) => {
                  expect(project.toJSON().collections.length).to.eq(0);
                  done();
                });
            });
        });
    });
  });

  describe("addCollectionToProject", () => {
    it("should remove the specified collection from the project", done => {
      chai.request(server)
        .post("/api/collections")
        .set("x-access-token", jwt_token)
        .send({
          title: "googledsds",
          is_private: false
        })
        .end((err, res) => {
          chai.request(server)
            .post("/api/projects/1/add")
            .set("x-access-token", jwt_token)
            .send({
              collection_id: res.body.collection.id
            })
            .end((err, res) => {
              expect(res.status).to.eq(200);
              expect(res.body.success).to.eq(true);
              Project
                .where({user_id: 1, id: 1})
                .fetch({require: true, withRelated: ["collections"]})
                .then((project) => {
                  expect(project.toJSON().collections.length).to.eq(1);
                  done();
                });
            });
        });
    });
  });
});
