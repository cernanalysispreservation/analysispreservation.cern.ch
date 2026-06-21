describe("Published Tests", function () {
  const firstTitle = "My First CMS Analysis";
  it("Publish a CMS Draft", () => {
    // create a new ALICE Analysis
    // given a random tiltle
    cy.createDraft("CMS Analysis", firstTitle, "cms");

    cy.visit("/");

    cy.get("[data-cy=DraftDocuments-list] a").first().click();

    // navigate to edit tab
    cy.get("[data-cy=itemNavEdit]").click();

    // fill in the required field
    cy.get("input#root\\!basic_info\\!cadi_id").type("JME-10-107");

    //save the draft
    cy.get("[data-cy=draft-save-btn]").click();

    // navigate to settings tab
    cy.get("[data-cy=itemNavSettings]").click();

    // click publish button
    cy.get("[data-cy=draftSettingsRecidButton]").click();

    // confirm publish action
    cy.get("[data-cy=draftSettingsPublish]").click();

    // make sure that the current version button is visible
    cy.get("[data-cy=draftSettingsCurrentVersionLink]");
  });
  it("A published report would not be deleted", () => {
    cy.loginUrl("cms@inveniosoftware.org", "cmscms");

    // safety handler, in order to have time for the re indexing of elastic
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get("[data-cy=PublishedDocumentsinCAP-list] a").first().click();

    cy.get("[data-cy=editPublished]").click();

    // navigate to settings tab
    cy.get("[data-cy=itemNavSettings]").click();

    cy.get("[data-cy=draft-delete-btn]").should("have.attr", "disabled");
  });
  it("Change a published into a Draft", () => {
    cy.loginUrl("cms@inveniosoftware.org", "cmscms");

    cy.get("[data-cy=PublishedDocumentsinCAP-list] a").first().click();

    cy.get("[data-cy=editPublished]").click();

    cy.get("[data-cy=changeToDraftButton]").click();

    cy.get("[data-cy=sidebarStatus]").contains("draft");
  });

  it("Does not allow publishing a draft with an empty required field", () => {
    cy.createDraft("CMS Analysis", "empty-required", "cms");

    cy.visit("/");

    cy.get("[data-cy=DraftDocuments-list] a").first().click();

    // 1. Check that the validation works without modifying the form data

    // navigate to settings tab
    cy.get("[data-cy=itemNavSettings]").click();

    // click publish button
    cy.get("[data-cy=draftSettingsRecidButton]").click();

    // confirm publish action
    cy.get("[data-cy=draftSettingsPublish]").click();

    // verify that it throws an error
    cy.get("div.ant-notification-notice-message").contains(
      "Validation Error while publishing"
    );

    // 2. Check the that the validation works after modifying the form data

    // navigate to edit tab
    cy.get("[data-cy=itemNavEdit]").click();

    // type in a normal field but leave the required field empty
    cy.get("textarea#root\\!basic_info\\!abstract").type("asd");

    // save the draft
    cy.get("[data-cy=draft-save-btn]").click();

    // navigate to settings tab
    cy.get("[data-cy=itemNavSettings]").click();

    // click publish button
    cy.get("[data-cy=draftSettingsRecidButton]").click();

    // confirm publish action
    cy.get("[data-cy=draftSettingsPublish]").click();

    // verify that it throws an error
    cy.get("div.ant-notification-notice-message").contains(
      "Validation Error while publishing"
    );
  });
});
