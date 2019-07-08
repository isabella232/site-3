describe('Homepage', function () {
  it('URL bar works', function () {
    cy.visit('/');

    cy.get('#url-entry-input').first().type('mycrypto.com{enter}');

    cy.url().should('eq', 'http://localhost:3000/browse/mycrypto.com');

    cy.get('#home-button').click();

    cy.url().should('eq', 'http://localhost:3000/');
  });
});