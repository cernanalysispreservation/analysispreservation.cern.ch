// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Login mechanism with the UI
Cypress.Commands.add("login", (email, password) => {
  cy.visit("/");
  cy.get("[data-cy=localLogin]").click();
  cy.get("input[type='email']").clear();
  cy.get("input[type='email']").type(email);
  cy.get("input[type='password']").clear();
  cy.get("input[type='password']").type(password);
  cy.get("button[type='submit']").click();
  cy.wait(2000);
});

// login mechanism with the request without using the UI
Cypress.Commands.add("loginUrl", (email, password) => {
  cy.request({
    method: "POST",
    url: "/api/login/local?next=/",
    body: { username: email, password: password }
  })
    .then(resp => {
      window.localStorage.setItem("token", "12345");
    })
    .then(resp => {
      cy.request({
        method: "GET",
        url: "/api/me"
      }).then(res => {
        cy.visit("/");
      });
    });
});

//logout
Cypress.Commands.add("logout", () => {
  cy.get("[data-cy=headerMenuAnchor]").click();
  cy.wait(1000);
  cy.get("a.not-underline span")
    .contains("Logout")
    .click({ force: true });
  cy.wait(1000);
  cy.url().should("eq", "http://localhost:3000/login?next=/");
});

// Create draft with a specific title

Cypress.Commands.add("createDraft", (anatype, generalTitle) => {
  cy.login("info@inveniosoftware.org", "infoinfo");
  cy.wait(2000);

  // open the Create modal
  cy.get("div")
    .contains("Create")
    .click();

  // type in a General Title
  cy.get("input[type='text']").type(generalTitle);

  // Select anatype
  cy.get("div")
    .contains(anatype)
    .click();

  // Start Preserving
  cy.get("div")
    .contains("Start Preserving")
    .click();

  cy.wait(1000);

  cy.url().should("include", "/drafts");
});

// Navigate to Form Builder
Cypress.Commands.add("goToFormBuilder", () => {
  cy.loginUrl("info@inveniosoftware.org", "infoinfo");
  cy.wait(2000);

  cy.visit("/cms");

  cy.wait(2000);
});
