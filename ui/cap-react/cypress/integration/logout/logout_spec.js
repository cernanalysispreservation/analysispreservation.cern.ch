describe("Logout Process", () => {
  it("Test Logout Process", () => {
    //login first
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // logout
    cy.wait(1000);
    cy.get("[data-cy=headerMenuAnchor]").click();
    cy.wait(1000);
    cy.get("a.not-underline span")
      .contains("Logout")
      .click({ force: true });
    cy.wait(1000);
    cy.url().should("eq", "http://localhost:3000/login?next=/");
  });
});
