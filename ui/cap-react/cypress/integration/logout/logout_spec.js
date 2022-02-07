describe("Logout Process", function() {
  it("Test Logout Process", function() {
    //login first
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    cy.get("[data-cy=headerMenu]").click();
    cy.get("[data-cy=logoutButton]").click();

    cy.url().should("include", "/login?next=/");
  });
});
