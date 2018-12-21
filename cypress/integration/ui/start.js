
describe('My First Test', function() {
	it('Does not do much!', function() {
		cy.visit('http://localhost:8080');
		cy.contains("add").click();
		cy.url().should('include', 'detail/Person/new');
		cy.get('[data-property="name"]').should('equal','undefined');
	})
});

