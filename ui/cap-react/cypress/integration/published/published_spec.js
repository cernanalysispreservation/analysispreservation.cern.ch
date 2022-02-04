import { PUBLISHED } from "../../routes";

describe("Published Tests", function() {
  const firstTitle = "My First CMS Analysis";
  it("Publish a CMS Draft", () => {
    // create a new ALICE Analysis
    // given a random tiltle
    cy.createDraft("CMS Analysis", firstTitle, "cms");

    cy.visit("/");

    cy.get("[data-cy=DraftDocuments-list] a")
      .first()
      .click();

    // navigate to settings tab
    cy.get("[data-cy=itemNavSettings]").click();

    // click publish button
    cy.get("[data-cy=draftSettingsRecidButton]").click();

    // confirm publish action
    cy.get(".ant-modal-footer .ant-btn-primary").click();

    // make sure that the current version button is visible
    cy.get("[data-cy=draftSettingsCurrentVersionLink]");
  });
  it("A published report would not be deleted", () => {
    cy.loginUrl("cms@inveniosoftware.org", "cmscms");

    // safety handler, in order to have time for the re indexing of elastic
    cy.wait(1000);
    cy.get("[data-cy=PublishedinCAPDocuments-list] a")
      .first()
      .click();

    cy.get("[data-cy=edit-published]").click();

    // navigate to settings tab
    cy.get("[data-cy=itemNavSettings]").click();

    cy.get("[data-cy=draft-delete-btn]").should("have.attr", "disabled");
  });
  it("Change a published into a Draft", () => {
    cy.loginUrl("cms@inveniosoftware.org", "cmscms");

    cy.get("[data-cy=PublishedinCAPDocuments-list] a")
      .first()
      .click();

    cy.get("[data-cy=edit-published]").click();

    cy.get("[data-cy=changeToDraftButton]").click();

    cy.get("[ data-cy=sidebarStatus]").contains("draft");
  });
});
