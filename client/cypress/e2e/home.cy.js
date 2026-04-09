describe("Home Page Tests", () => {

  //Hook for setup
  beforeEach(() => {
    cy.visit("/")
  })

  it("should load homepage successfully", () => {
    cy.contains("FundTrust").should("exist")
  })

  it("should display navigation menu", () => {

    //Assertions
    cy.contains("About").should("exist")
    cy.contains("Contact").should("exist")
    cy.contains("Feedback").should("exist")
    cy.contains("Log in").should("exist")
    cy.contains("Get Started").should("exist")
  })

  it("should navigate to feedback page", () => {
    cy.contains("Feedback").click()
    cy.url().should("include", "/feedback")
  })
})