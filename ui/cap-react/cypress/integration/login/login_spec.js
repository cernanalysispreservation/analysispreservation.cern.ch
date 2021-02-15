describe("Login Process", () => {
  it("Login as Atlas member", () => {
    // login
    cy.login("atlas@inveniosoftware.org", "atlasatlas");

    //assert the login
    cy.url().should("eq", "http://localhost:3000/");
    cy.logout();
  });

  it("Password is required", () => {
    // open the login form
    cy.get("div.localLogin").click();

    cy.get("input[type='email']").type("{enter}");

    cy.get("div.grommetux-background-color-index-critical");
  });

  it("Email is required", () => {
    cy.visit("/");
    // open the login form
    cy.get("div.localLogin").click();

    cy.get("input[type='email']").clear();
    cy.get("input[type='email']").type("{enter}");

    cy.get("div.grommetux-background-color-index-critical");
  });
  it("Password is required", () => {
    cy.visit("/");
    // open the login form
    cy.get("div.localLogin").click();

    cy.get("input[type='email']").type("{enter}");

    cy.get("div.grommetux-background-color-index-critical");
  });

  it("Valid email is required", () => {
    cy.visit("/");
    // open the login form
    cy.get("div.localLogin").click();

    cy.get("input[type='email']").type("vljknfjn@ckbdj.cd{enter}");

    // error message
    cy.get("div.grommetux-background-color-index-critical");
  });

  it("Password and email are required", () => {
    cy.visit("/");
    // open the login form
    cy.get("div.localLogin").click();

    cy.get("input[type='email']").clear();
    cy.get("input[type='password']").clear();

    cy.get("button[type='submit']").click();

    // error message
    cy.get("div.grommetux-background-color-index-critical");
  });
});
