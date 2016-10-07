import Resource from '../../src/server/models/resource';

describe("Resource model tests", () => {
  beforeEach(done => {
    knex.seed.run()
      .then(() => {
        done();
      });
  });

  it("ensures that the maximum length of a resource name is 20", done => {
    new Resource({
      name: "abcdfhskdjfkdhfkfhkjfdshfjdskfhsdjfdhsfkjdfhsjk",
      link: "google.com"
    })
    .save()
    .catch(err => {})
    .finally(() => {
      Resource.count()
        .then(count => {
          expect(count).to.equal(598);
          done();
        });
    });
  });
});
