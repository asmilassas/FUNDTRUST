describe("API Mocking Tests", () => {

  it("should mock feedback API response", () => {

    cy.intercept("GET", "/api/feedback", {
      statusCode: 200,
      body: {
        feedback: [
          {
            _id: "1",
            rating: 5,
            comment: "Mocked feedback",
            user: { name: "Mock User" }
          }
        ]
      }
    }).as("getFeedback")

    cy.visit("/feedback")
    cy.wait("@getFeedback")
    cy.contains("Mocked feedback").should("exist")
  })
})