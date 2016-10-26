import Organization from '../../src/server/models/organization';

describe("Organization model tests", () => {
  beforeEach(done => {
    knex.seed.run()
      .then(() => {
        done();
      });
  });

  it("ensures that a name is provided", done => {
    new Resource({
      name: "Organization Name"
    })
    .save()
    .catch(err => {})
    .finally(() => {
      Organization.count()
        .then(count => {
          expect(count).to.equal(4);
          done();
        });
    });
  });
});

