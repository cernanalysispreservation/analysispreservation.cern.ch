describe("Search Integration Suite", function() {
  it("Navigate to search page for drafts results", function() {
    // we login to the platform
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // find the search bar
    cy.get("[data-cy=searchbar]").type("cern{enter}");

    cy.url().should("include", "drafts?q=cern");

    // Checked means that the search is for Drafts
    cy.get("[data-cy=searchStatus]").should("have.class", "ant-switch-checked");

    // Checked means that is from me and unchecked from all
    cy.get("[data-cy=searchCreated]").should(
      "not.have.class",
      "ant-switch-checked"
    );
  });

  it("Navigate to search page for published results", function() {
    // login first
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // find the search bar
    cy.get("[data-cy=searchbar]").type("cern{enter}");

    // Checked means that the search is for Drafts
    cy.get("[data-cy=searchStatus]").should("have.class", "ant-switch-checked");

    cy.get("[data-cy=searchStatus]").click();

    cy.get("[data-cy=searchStatus]").should(
      "not.have.class",
      "ant-switch-checked"
    );
    // validate the url
    cy.url().should("include", "/search?q=cern");
  });
});
