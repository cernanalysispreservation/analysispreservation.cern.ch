describe("Search Integration Suite", () => {
  it("Navigate to search page, from dashboard", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // find the search bar
    cy.get("input[type='search']")
      .should("have.attr", "id", "searchbar")
      .type("cern{enter}");

    cy.wait(1000);

    cy.url().should("eq", "http://localhost:3000/search?q=cern");

    cy.wait(1000);
    cy.get("input#search_facet_published_checkbox").should(
      "have.attr",
      "checked"
    );
    cy.get("input#search_facet_yours_checkbox").should("have.attr", "checked");
  });

  it("Navigate to the drafts page", () => {
    // login first
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // find the search bar
    cy.get('input[type="search"]')
      .should("have.attr", "id", "searchbar")
      .type("cern");
    // find the draft div
    cy.get("div.grommetux-search__suggestion")
      .first()
      .click();

    cy.get("input#search_facet_published_checkbox").should(
      "not.have.attr",
      "checked"
    );

    // validate the url
    cy.url().should("eq", "http://localhost:3000/drafts?q=cern");
  });
});
