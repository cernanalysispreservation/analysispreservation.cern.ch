describe("Reviews Platform", () => {
  it("Publish and review a record from info", () => {
    cy.createDraft("CMS Statistics Questionnaire", "Check for Reviews", "info");

    // navigate to settings tab
    cy.get("[data-cy=itemNavSettings]").click();

    cy.get("[data-cy=reviewShowModal]").click();

    cy.get("[data-cy=reviewOptions]").contains("Approve").click();

    cy.get("[data-cy=reviewAddComment]").type(
      "This is a great report I will approve it"
    );

    cy.get("[data-cy=submitReview]").click();

    // click publish button
    cy.get("[data-cy=draftSettingsRecidButton]").click();

    // confirm publish action
    cy.get("[data-cy=draftSettingsPublish]").click();

    // navigate to the published item
    cy.get("[data-cy=draftSettingsCurrentVersionLink]").click();

    // make sure that show review modal button exists
    cy.get("[data-cy=reviewShowModal]").should("exist");
    cy.get("[data-cy=reviewShowReviews]").should("exist");
  });

  it("Login from CMS account, and validate that you can not add reviews to the previous published", () => {
    cy.loginUrl("cms@inveniosoftware.org", "cmscms");

    cy.get("[data-cy=PublishedDocumentsinCAP-list] a").first().click();

    cy.get("[data-cy=reviewShowModal]").should("not.exist");
    cy.get("[data-cy=reviewShowReviews]").should("exist");
  });
});
