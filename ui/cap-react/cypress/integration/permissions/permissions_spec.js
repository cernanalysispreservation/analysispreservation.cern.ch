import { CREATE } from "../../routes";

describe("Validate Deposit Groups", () => {
  it("Deposit Groups for a  CMS member", () => {
    // login and navigate to create route
    cy.loginUrl("cms@inveniosoftware.org", "cmscms", CREATE);

    // find out if the deposit groups are the correct ones
    // CMS Analysis and CMS Statistics Questionnaire
    cy.get("[data-cy=anatype]")
      .children("label")
      .each(value => {
        cy.wrap(value)
          .get("span")
          .contains("CMS Analysis" || "CMS Statistics Questionnaire");
      });
  });
  it("Deposit Groups for an ATLAS member", () => {
    cy.loginUrl("atlas@inveniosoftware.org", "atlasatlas", CREATE);

    // find out if the deposit groups are the correct ones
    // Atlas Analysis
    cy.get("[data-cy=anatype]")
      .children("label")
      .each(value => {
        cy.wrap(value).get("span").contains("ATLAS Analysis");
      });
  });
  it("Deposit Groups for an Alice member", () => {
    cy.loginUrl("alice@inveniosoftware.org", "alicealice", CREATE);

    // find out if the deposit groups are the correct ones
    // Alice Analysis
    cy.get("[data-cy=anatype]")
      .children("label")
      .each(value => {
        cy.wrap(value).get("span").contains("ALICE Analysis");
      });
  });
  it("Deposit Groups for an LHCB member", () => {
    cy.loginUrl("lhcb@inveniosoftware.org", "lhcblhcb", CREATE);

    // find out if the deposit groups are the correct ones
    // LHCb analysis
    cy.get("[data-cy=anatype]")
      .children("label")
      .each(value => {
        cy.wrap(value).get("span").contains("LHCb Analysis");
      });
  });
});

describe("Visit create path, with a specific analysis name", () => {
  it("Cms analysis should be pre selected", () => {
    cy.loginUrl("cms@inveniosoftware.org", "cmscms", `${CREATE}/cms-analysis`);

    cy.get("[data-cy=anatype] label.ant-radio-button-wrapper-checked").contains(
      "CMS Analysis"
    );
  });

  it("Fetch an analysis with no permissions", () => {
    cy.loginUrl(
      "cms@inveniosoftware.org",
      "cmscms",
      `${CREATE}/atlas-analysis`
    );

    cy.get("[data-cy=permission-warning-alert]");
  });
});
