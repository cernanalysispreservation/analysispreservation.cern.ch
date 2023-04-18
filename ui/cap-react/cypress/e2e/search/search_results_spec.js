import { DRAFTS } from "../../routes";

describe("Search Results Suite", () => {
  const generalTitle = String(new Date().getTime());
  it("Create a draft and find it throught search", () => {
    // create a draft analysis
    cy.createDraft("CMS Analysis", generalTitle, "cms");

    // find the search bar and search with the title
    cy.get("[data-cy=searchbar]").type(`${generalTitle}{enter}`);

    cy.get(`[data-cy=${generalTitle}]`).click({ force: true });

    // navigate to settings tab
    cy.get("[data-cy=itemNavSettings]").click();

    // open the Popconfirm
    cy.get("[data-cy=draft-delete-btn]").click();

    // validate delete
    cy.get(".ant-popconfirm-buttons button").contains("Delete").click();

    cy.url().should("not.include", DRAFTS);
  });

  it("Update the sorting", () => {
    // login as superuser
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // navigate to the search page
    cy.get("[data-cy=searchbar]").type("{enter}");

    // the url params should not have a sort param
    cy.url().should("not.include", "&sort=");

    // oldest first
    cy.get("[data-cy=sortSelectMenu]").click();
    cy.get("[data-cy=-mostrecent]").click();
    cy.url().should("include", "&sort=-mostrecent");
    // newest first
    cy.get("[data-cy=sortSelectMenu]").click();
    cy.get("[data-cy=mostrecent]").click();
    cy.url().should("include", "&sort=mostrecent");
    // best match
    cy.get("[data-cy=sortSelectMenu]").click();
    cy.get("[data-cy=bestmatch]").click();
    cy.url().should("include", "&sort=bestmatch");
  });
});
