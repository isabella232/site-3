describe('Homepage', function () {
  it('URL bar works', function () {
    cy.visit('/');

    cy.get('#dapp-search-bar').first().type('mycrypto.com');

    cy.location('hash').should('eq', '#search=mycrypto.com');

    cy.get('.card').first().click();

    cy.location('pathname').should('eq', '/browse/mycrypto.com%2Faccount');

    cy.get('#home-button').click();

    cy.location('pathname').should('eq', '/');
  });
});