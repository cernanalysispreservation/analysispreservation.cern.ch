describe("Reviews Platform", () => {
  it("Publish a record from info", () => {
    cy.createDraft("CMS Statistics Questionnaire", "Check for Reviews", "info");

    cy.get("[data-cy=draft-settings]").click();

    cy.get("[data-cy=show-review-modal]").click();

    cy.get("[data-cy=add-review-comment]").type(
      "This is a great report I will approve it"
    );

    cy.get("[data-cy=review-type-approved]").click();

    cy.get("[data-cy=add-review]").click();

    cy.get("[data-cy=settings-publish-btn]").click();

    cy.get("[data-cy=layer-primary-action]").click();

    cy.get("[data-cy=show-reviews]").should("exist");
    cy.get("[data-cy=show-review-modal]").should("exist");
  });

  it("Login from CMS account, and validate that you can not add reviews to the previous published", () => {
    cy.login("cms@inveniosoftware.org", "cmscms");

    cy.get("[data-cy=publishedincollaboration-list] a")
      .first()
      .click();

    cy.get("[data-cy=show-reviews]").should("exist");
    cy.get("[data-cy=show-review-modal]").should("not.exist");
  });
});
