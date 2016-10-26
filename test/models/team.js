import Team from '../../src/server/models/team';

describe("Team model tests", () => {
  beforeEach(done => {
    knex.seed.run()
      .then(() => {
        done();
      });
  });

  it("ensures that the maximum length of a team name is 20", done => {
    new Team({
      name: "Title of team"
    })
    .save()
    .catch(err => {})
    .finally(() => {
      Team.count()
        .then(count => {
          expect(count).to.equal(4);
          done();
        });
    });
  });
});

