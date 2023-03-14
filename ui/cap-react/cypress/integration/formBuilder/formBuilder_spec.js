import { CMS } from "../../routes";

describe("Form Builder", function() {
  // with respect to the current working folder

  it("Select the CMS Analysis from the predefined schems", function() {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo", CMS);

    // select the div contains the CMS Analysis text
    cy.get("[data-cy=admin-predefined-content]")
      .contains("CMS Analysis")
      .click();

    cy.url().should("include", "cms-analysis");
  });

  it("Select the CMS Statistics Questionnaire from the predefined schems", function() {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo", CMS);

    // select the div contains the CMS Analysis text
    cy.get("[data-cy=admin-predefined-content]")
      .contains("CMS Statistics Questionnaire")
      .click();

    cy.url().should("include", "cms-stats-questionnaire");
  });

  it("Start a new schema on your own", function() {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo", CMS);

    const name = "Name of the form";
    const description = "Description of the form";

    // Find the form and add a new name
    cy.get("[data-cy=admin-form-name]").type(name);
    cy.get("[data-cy=admin-form-description]").type(description);

    // create the form
    cy.get("[data-cy=admin-form-submit]").click();

    cy.url().should("include", `${CMS}/new`);
  });

  // it("Download Schema File", () => {
  //   cy.goToFormBuilder();

  //   const name = "Name of the form";
  //   const description = "Description of the form";
  //   const exportSchema = "Export Schema";
  //   const downloadedFilename = path.join(
  //     "Users/antoniospapadopoulos⁩/Downloads/",
  //     "fileName.json"
  //   );

  //   // Find the form and add a new name
  //   cy.wait(2000);
  //   cy.get("input#root_name").type(name);
  //   cy.get("textarea#root_description").type(description);

  //   // create the form
  //   cy.get("form div")
  //     .contains("Create")
  //     .click();

  //   cy.wait(2000);

  //   cy.get("header div")
  //     .contains(exportSchema)
  //     .click();

  //   cy.log("Start of download");

  //   // description is the same as the one entered when creating
  //   cy.readFile(downloadedFilename)
  //     .its("deposit_schema.description")
  //     .should("eq", description);
  //   cy.readFile(downloadedFilename)
  //     .its("fullname")
  //     .should("eq", name);
  // });
});
