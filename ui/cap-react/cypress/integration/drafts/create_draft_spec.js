describe("Create Draft", () => {
  it("Update the general title of the draft", () => {
    let firstTitle = "Random Title";
    let updatedTitle = "This is my new title";

    // create a new ALICE Analysis
    // given a random tiltle
    cy.createDraft("ALICE Analysis", firstTitle);

    // get the title div
    // and enable editing
    cy.get("div")
      .contains(firstTitle)
      .click();

    // erase the previous title and insert the new one
    cy.get("[data-cy=general-title-input]")
      .should("have.value", firstTitle)
      .clear()
      .type(updatedTitle);

    // approve the changes
    cy.get("[data-cy=checkmark]").click();

    cy.wait(2000);

    // search the new title
    cy.get("div")
      .contains(updatedTitle)
      .click();
    // make sure that the previous is not there and the update was succesfull
    cy.get("div")
      .contains(firstTitle)
      .should("not.exist");
  });
  it("Update the title but discard saving", () => {
    let firstTitle = "Random Title";
    let updatedTitle = "This is my new title";

    // create a new ALICE Analysis
    // given a random tiltle
    cy.createDraft("ALICE Analysis", firstTitle);

    // get the title div
    // and enable editing
    cy.get("div")
      .contains(firstTitle)
      .click();

    // erase the previous title and insert the new one
    cy.get("[data-cy=general-title-input]")
      .should("have.value", firstTitle)
      .clear()
      .type(updatedTitle);

    // approve the changes
    cy.get("[data-cy=closeicon]").click();

    cy.wait(2000);

    // search the new title
    cy.get("div")
      .contains(firstTitle)
      .click();
    // make sure that the previous is not there and the update was succesfull
    cy.get("div")
      .contains(updatedTitle)
      .should("not.exist");
  });

  it("Does not allow to continue when anatype is not selected", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    cy.get("div#ct-container").should("not.exist");
    // open the Create modal
    cy.get("div")
      .contains("Create")
      .click();

    // type in a General Title
    cy.get("input[type='text']").type("This is my new draft");

    // Start Preserving
    cy.get("div")
      .contains("Start Preserving")
      .click();

    cy.wait(1000);

    cy.url().should("eq", "http://localhost:3000/");
  });
});
