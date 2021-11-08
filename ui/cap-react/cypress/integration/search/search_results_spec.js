import { DRAFTS } from "../../routes";

describe("Search Results Suite", () => {
  const generalTitle = "testSearchForIt";
  it("Create a draft and find it throught search", () => {
    // create a draft analysis
    cy.createDraft("CMS Analysis", generalTitle, "cms");

    cy.get("input[type='search']")
      .should("have.attr", "id", "searchbar")
      .type(`${generalTitle}{enter}`);

    cy.get("input#search_facet_published_checkbox").click({ force: true });

    cy.get(`[data-cy=${generalTitle}] a`).click({ force: true });

    // navoigate to settings tab
    cy.get("[data-cy=draft-settings]").click();

    cy.get("[data-cy=draft-delete-btn]").click();

    cy.get("[data-cy=layer-primary-action]").click();

    cy.url().should("not.include", DRAFTS);
    cy.wait(1000);
  });

  it("Update the sorting", () => {
    // login as superuser
    cy.login("info@inveniosoftware.org", "infoinfo");

    // navigate to the search page
    cy.get('input[type="search"]')
      .should("have.attr", "id", "searchbar")
      .type("{enter}");

    // the url params should not have a sort param
    cy.url().should("not.include", "&sort=");

    // open the menu and update the sorting to bestmatch
    cy.get("[data-cy=search-page-sorting]").click();
    cy.get("[data-cy=search-page-sorting-bestmatch]").click();
    cy.url().should("include", "&sort=bestmatch");

    // open the menu and update the sorting to bestmatch
    cy.get("[data-cy=search-page-sorting]").click();
    cy.get("[data-cy=search-page-sorting-mostrecent]").click();
    cy.url().should("include", "&sort=mostrecent");
  });
});
