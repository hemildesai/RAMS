import Collection from '../../src/server/models/collection';

describe("Collection Model Tests", () => {
		beforeEach( done => {
    		knex.seed.run()
      		.then(() => {
    		done();
    	});
	});

it("Ensures that the name of the Collection is not null", done => {
		new Collection ({
			title: "Collection_A"
		})
		.save()
		.catch(err => {})
		.finally(() => {
			Collection.count()
				.then(count => {
					expect(count).to.equal(5);
					done();
			});
		});
	});
});
