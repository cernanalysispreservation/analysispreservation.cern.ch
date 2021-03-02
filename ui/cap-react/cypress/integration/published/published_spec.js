describe("Published Tests", () => {
  const firstTitle = "My First CMS Analysis";
  it("Publish a CMS Draft", () => {
    // create a new ALICE Analysis
    // given a random tiltle
    cy.createDraft("CMS Analysis", firstTitle, "cms");

    cy.visit("http://localhost:3000/");

    cy.get("[data-cy=drafts-list] a")
      .first()
      .click();

    // navoigate to settings tab
    cy.get("[data-cy=draft-settings]").click();

    // click publish button
    cy.get("[data-cy=settings-publish-btn]").click();

    // confirm publish action
    cy.get("[data-cy=layer-primary-action]").click();

    // check if it was moved to the publised
    cy.wait(1000);
    cy.url().should("include", "/published");
  });
  it("Delete a Published report is not possible", () => {});
  it("Change a published into a Draft", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[data-cy=drafts-list] a")
      .first()
      .click();

    // navoigate to settings tab
    cy.get("[data-cy=draft-settings]").click();

    // click publish button
    cy.get("[data-cy=settings-publish-btn]").click();

    // confirm publish action
    cy.get("[data-cy=layer-primary-action]").click();
    cy.get("[data-cy=edit-published]").click();

    // check the status to be published
    cy.get("[data-cy=deposit-status-tag]").contains("published");

    // find the button to change the status to draft
    cy.get("[data-cy=change-to-draft]").click();

    // check the status to be published
    cy.get("[data-cy=deposit-status-tag]").contains("draft");
  });
});
