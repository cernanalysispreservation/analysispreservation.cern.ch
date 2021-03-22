describe("Login Process", () => {
  it("Password is required", function() {
    cy.visit("/");
    // open the login form
    cy.get("div.localLogin").click();

    cy.get("input[type='email']").type("{enter}");

    cy.get("div.grommetux-background-color-index-critical");
  });

  it("Email is required", function() {
    cy.visit("/");
    // open the login form
    cy.get("div.localLogin").click();

    cy.get("input[type='email']").clear();
    cy.get("input[type='email']").type("{enter}");

    cy.get("div.grommetux-background-color-index-critical");
  });
  it("Password is required", function() {
    cy.visit("/");
    // open the login form
    cy.get("div.localLogin").click();

    cy.get("input[type='email']").type("{enter}");

    cy.get("div.grommetux-background-color-index-critical");
  });

  it("Valid email is required", function() {
    cy.visit("/");
    // open the login form
    cy.get("div.localLogin").click();

    cy.get("input[type='email']").type("vljknfjn@ckbdj.cd{enter}");

    // error message
    cy.get("div.grommetux-background-color-index-critical");
  });

  it("Password and email are required", function() {
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
