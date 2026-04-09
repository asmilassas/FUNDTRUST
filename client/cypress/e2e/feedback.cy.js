//BDD syntax
describe("Feedback Page Tests", () => {

  //hook for setup 
  beforeEach(() => {

    // Mock logged-in user (required for feedback form)(Mocking)
    cy.window().then((win) => {
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          _id: "123",
          name: "Test User"
        })
      )
    })
    cy.visit("/feedback")
  })

  it("should load feedback page", () => {
    //Assertion
    cy.contains("Platform Feedback").should("exist")
  })

  it("should submit feedback form", () => {

    //Assertions
    // Select rating
    cy.get("select").select("5")

    // Enter comment
    cy.get("textarea").type("Great platform!")

    // Submit feedback
    cy.contains("Submit").click()
  })
})