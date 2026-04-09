describe("Login Tests", () => {

  beforeEach(() => {
    cy.visit("/login")
  })

  it("should display login form fields", () => {
    //Assertions
    cy.get('input[type="email"]').should("exist")
    cy.get('input[type="password"]').should("exist")
  })


  it("should login using fixture data", () => {

    //Fixture usage
    cy.fixture("user").then((user) => {
      //Assertions
      cy.get('input[type="email"]').type(user.email)
      cy.get('input[type="password"]').type(user.password)
      cy.get("button").click()

      // Login attempt occurs
      cy.url().should("eq", Cypress.config().baseUrl + "/") // Check URL
    })
  })
})