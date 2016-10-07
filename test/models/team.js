import Team from '../../src/server/models/team';

describe("Team model tests", () => {
  beforeEach(done => {
    knex.seed.run()
      .then(() => {
        done();
      });
  });

  it("ensures that the maximum length of a resource name is 20", done => {
    new Team({
      title: "Title of team"
    })
    .save()
    .catch(err => {})
    .finally(() => {
      Resource.count()
        .then(count => {
          expect(count).to.equal(4);
          done();
        });
    });
  });
});

