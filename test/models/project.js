import Project from '../../src/server/models/project';

describe("Project Model Tests", () => {
		beforeEach( done => {
    		knex.seed.run()
      		.then(() => {
    		done();
    	});
	});

it("Ensures that the name of the project is not null", done => {
		new Project ({
			title: "Project_A"
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
