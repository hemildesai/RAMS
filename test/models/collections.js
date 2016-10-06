import Collections from '../../src/server/models/collections';

describe("Collection Model Tests", () => {
		beforeEach( done => {
    		knex.seed.run()
      		.then(() => {
    		done();
    	});
	});

it("Ensures that the name of the Collection is not null", done => {
		new Collection ({
			collection_name: "Collection_A"
		})
		.save()
		.catch(err => {})
		.finally(() => {
			Project.count()
				.then(count => {
					expect(count).to.equal(4);
					done();
			});
		});
	});
});