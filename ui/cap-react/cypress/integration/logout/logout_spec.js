describe("Logout Process", function() {
  it("Test Logout Process", function() {
    //login first
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // logout
    cy.wait(1000);
    cy.get(".headerMenuAppp").click();
    cy.wait(1000);
    cy.get("a.not-underline span")
      .contains("Logout")
      .click({ force: true });
    cy.wait(1000);
    cy.url().should("include", "/login?next=/");
  });
});
