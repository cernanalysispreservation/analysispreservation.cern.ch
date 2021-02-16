// const path = require("path");
const autoRecord = require("cypress-autorecord"); // Require the autorecord function

describe("Form Builder", () => {
  autoRecord();

  // it("Select the CMS Analysis from the predefined schems", () => {
  //   cy.goToFormBuilder();

  //   // select the div contains the CMS Analysis text
  //   cy.get("[data-cy=contentType] div")
  //     .contains("CMS Analysis")
  //     .click();

  //   cy.wait(2000);

  //   cy.get("[data-cy=schemaTitle]").contains("CMS Analysis");
  // });

  // it("Start a new schema on your own", () => {
  //   cy.goToFormBuilder();

  //   const name = "Name of the form";
  //   const description = "Description of the form";

  //   // Find the form and add a new name
  //   cy.wait(2000);
  //   cy.get("input#root_name").type(name);
  //   cy.get("textarea#root_description").type(description);

  //   // create the form
  //   cy.get("form div")
  //     .contains("Create")
  //     .click();

  //   cy.wait(2000);

  //   cy.get("[data-cy=schemaTitle]").contains(name);
  // });

  // it("Download Schema File", () => {
  //   cy.goToFormBuilder();

  // with respect to the current working folder
  // const downloadsFolder = "cypress/downloads";

  //   const name = "Name of the form";
  //   const description = "Description of the form";
  //   const exportSchema = "Export Schema";
  //   const downloadedFilename = path.join(downloadsFolder, "fileName.json");

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
