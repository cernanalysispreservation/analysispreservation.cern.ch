import { DRAFTS } from "../../routes";

describe("Create Draft", function () {
  let firstTitle = "Random Title";
  let updatedTitle = "This is my new title";
  it("Create a new Draft", () => {
    // create a new CMS Analysis
    // given a random tiltle
    cy.createDraft("CMS Analysis", firstTitle);
  });

  it("Update the title but discard saving", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // navigate to the draft
    cy.get("[data-cy=DraftDocuments-list] a").first().click();

    cy.get("[data-cy=editableTitleEdit]").click();

    cy.get("[data-cy=editableInput]").type(updatedTitle);

    // cancel the changes
    cy.get("[data-cy=editableTitleClose]").click();

    cy.get("[data-cy=editableTitleValue]").contains(firstTitle);
  });

  it("Update the general title of the draft", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    cy.get("[data-cy=DraftDocuments-list] a").first().click();

    cy.get("[data-cy=editableTitleEdit]").click();

    // erase the previous title and insert the new one
    cy.get("[data-cy=editableInput]").clear().type(`${updatedTitle}{enter}`);

    cy.get("[data-cy=editableTitleValue]").contains(updatedTitle);
  });

  it("Delete Draft", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    cy.get("[data-cy=DraftDocuments-list] a").first().click();

    // navigate to settings tab
    cy.get("[data-cy=itemNavSettings]").click();

    // open the Popconfirm
    cy.get("[data-cy=draft-delete-btn]").click();

    // validate delete
    cy.get(".ant-popconfirm-buttons button").contains("Delete").click();

    cy.url().should("not.include", DRAFTS);
  });

  it("Does not allow to continue when anatype is not selected", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // open the Create modal
    cy.get("[data-cy=headerCreateButton]").contains("Create").click();

    // type in a General Title
    cy.get("input[type='text']").type("This is my new draft");

    // Start Preserving
    cy.get("div").contains("Start Preserving").click();

    cy.url().should("not.include", DRAFTS);
  });
});
