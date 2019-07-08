describe('Homepage', function () {
  it('URL bar works', function () {
    cy.visit('/');

    cy.get('#url-entry-input').first().type('mycrypto.com{enter}');

    cy.location('pathname').should('eq', '/browse/mycrypto.com');

    cy.get('#home-button').click();

    cy.location('pathname').should('eq', '/');
  });
});