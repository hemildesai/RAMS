import Project from '../../src/server/models/project';

describe("Project Model Tests", () => {
		beforeEach( done => {
    		knex.seed.run()
      		.then(() => {
    		done();
    	});
	});

it("Ensures that the name of the project is not null", done => {
		new Project (
		)
		.save()
		.catch(err => {})
		.finally(() => {
			Project.count()
				.then(count => {
					expect(count).to.equal(3);
					done();
			});
		});
	});
});
