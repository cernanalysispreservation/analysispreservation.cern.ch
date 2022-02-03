describe("Settings Page", function() {
  const newIdTitle =
    "this is my new title" +
    new Date().toLocaleString("en-GB", { timeZone: "UTC" });
  it("add new token", function() {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo", "/settings");

    // click button to add token
    cy.get("[data-cy=settingsAddToken]").click({ force: true });

    // create a new token
    cy.get("[data-cy=settingsTokenInput] input").type(`${newIdTitle}{enter}`);

    // check that the new id exists in the list
    cy.get("[data-cy=settingsTableTokens]").contains(newIdTitle);
  });

  it("Delete the Token from the list", function() {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo", "/settings");

    cy.contains(newIdTitle)
      .parent("tr")
      .within(() => {
        cy.get("td")
          .eq(2)
          .click();
      });
  });
});
