describe("Settings Page", () => {
  const newIdTitle =
    "this is my new title" +
    new Date().toLocaleString("en-GB", { timeZone: "UTC" });
  it("add new token", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    cy.wait(1000);
    // open menu
    cy.get("[data-cy=header-menu]").click();

    cy.wait(1000);
    // select settings
    cy.get("[data-cy=settings-menuitem]").click();

    // open the modal
    cy.get("[data-cy=settings-add-token]").click();

    // type a new id
    cy.get("[data-cy=settings-token-form] form input").type(
      `${newIdTitle}{enter}`
    );
    // check that the new id exists in the list
    cy.get("[data-cy=settings-table-token-id]").contains(newIdTitle);
  });

  it("Delete the Token from the list", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    cy.wait(1000);
    // open menu
    cy.get("[data-cy=header-menu]").click();

    cy.wait(1000);
    // select settings
    cy.get("[data-cy=settings-menuitem]").click();

    cy.contains(newIdTitle)
      .parent("tr")
      .within(() => {
        cy.get("td")
          .eq(3)
          .click();
      });
  });
});
