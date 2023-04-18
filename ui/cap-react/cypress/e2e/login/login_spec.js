describe("Login Process", () => {
  it("Password is required", function () {
    cy.visit("/");
    // open the login form
    cy.get("[data-cy=localLogin]").click();

    cy.get("[data-cy=localLoginSubmitButton]").click();

    cy.get("[data-cy=localLoginErrorMessage]");
  });

  it("Email is required", function () {
    cy.visit("/");
    // open the login form
    cy.get("[data-cy=localLogin]").click();

    cy.get("[data-cy=emailInput] input[type='email']").clear({ force: true });

    cy.get("[data-cy=localLoginSubmitButton]").click();

    cy.get("[data-cy=localLoginErrorMessage]");
  });

  it("Valid email is required", function () {
    cy.visit("/");
    // open the login form
    cy.get("[data-cy=localLogin]").click();

    cy.get("[data-cy=emailInput] input[type='email']").clear({ force: true });
    cy.get("[data-cy=emailInput] input[type='email']")
      .first()
      .type("hfjdhjfd@fghd.fd");

    cy.get("[data-cy=localLoginSubmitButton]").click();

    cy.get("[data-cy=localLoginErrorMessage]");
  });

  it("Password and email are required", function () {
    cy.visit("/");
    // open the login form
    cy.get("[data-cy=localLogin]").click();

    cy.get("[data-cy=emailInput] input[type='email']").clear({ force: true });
    cy.get("[data-cy=passwordInput] input[type='password']").clear({
      force: true,
    });

    cy.get("[data-cy=localLoginSubmitButton]").click();

    cy.get("[data-cy=localLoginErrorMessage]");
  });
});
