
describe('My First Test', function() {
	it('Does not do much!', function() {
		cy.visit('http://localhost:8080');
		cy.contains("add").click();
		cy.url().should('include', 'detail/Person/new');
		cy.get('input[data-property="name"]').type('Kurt Humbuk');
		cy.get('input[data-property="address"]').type('Svindelvej 1');
		cy.get('input[data-property="zipcode"]').type('2500');
		cy.get('input[data-property="town"]').type('Valby');
		cy.contains("save").click();
		cy.url().should('include', 'list/Person');
		cy.get('a > .material-icons').click();
	})
});

