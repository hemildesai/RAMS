var jwt_token;
import Team from '../../src/server/models/team.js';
import {authenticate_user} from '../helpers/authentication_helper.js';

describe("Team controller tests", () => {

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

  describe("postTeam", () => {
    it("should create a Team", (done)  => {
      chai.request(server)
        .post("/api/teams")
        .set("x-access-token", jwt_token)
        .send({
          name: "timepass",
          organization_id: 1
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.team).to.not.be.undefined;
          expect(res.body.team.name).to.eq("timepass");
          Team.count()
            .then(count => {
              expect(count).to.equal(4);
              done();
            });
        });
    });
  });

  describe("getTeams", () => {
    it("should get all teams that are valid for the organization", (done)  => {
      chai.request(server)
        .get("/api/teams")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.teams.length).to.eq(1);

          res.body.teams.forEach(c => {
            // expect(c.name).to.include("test");
            expect(c.organization_id).to.eq(1);
          });

          done();
        });
    });
  });

  describe("getTeam", () => {
    it("should get a team if its valid", (done)  => {
      chai.request(server)
        .get("/api/teams/1")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.team).to.not.be.undefined;
          expect(res.body.team.name).to.eq("team1");
          done();
        });
    });

    it("should not get a team if it's not valid", (done)  => {
      chai.request(server)
        .get("/api/teams/5")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(false);
          expect(res.body.team).to.be.undefined;
          done();
        });
    });
  });

  describe("putTeam", () => {
    it("should edit a organization's team", (done)  => {
      chai.request(server)
        .put("/api/teams/1")
        .set("x-access-token", jwt_token)
        .send({
          name: "newteamname",
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.team).to.not.be.undefined;
          expect(res.body.team.name).to.eq("newteamname");
          expect(res.body.team.organization_id).to.eq(1);
          done();
        });
    });

    it("should not edit another organization's team", (done)  => {
      chai.request(server)
        .put("/api/teams/3")
        .set("x-access-token", jwt_token)
        .send({
          name: "anotherteam",
        })
        .end((err, res) => {
          expect(res.status).to.eq(401);
          done();
        });
    });
  });

  describe("deleteTeam", () => {
    it("should delete an organization's team", (done)  => {
      chai.request(server)
        .delete("/api/teams/1")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.success).to.eq(true);
          expect(res.body.message).to.eq("Team 1 destroyed");
          done();
          // Team.count()
          //   .then(count => {
          //     expect(count).to.equal(0);
          //     // done();
          //   })
          //   .finally(() => {
          //     done();
          //   });
        });
    });

    it("should not delete another organization's team", (done)  => {
      chai.request(server)
        .delete("/api/teams/3")
        .set("x-access-token", jwt_token)
        .end((err, res) => {
          expect(res.status).to.eq(401);
          done();
        });
    });
  });

});
