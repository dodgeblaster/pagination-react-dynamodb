describe('My First Test', () => {
    it('Does not do much!', () => {
        cy.visit('https://localhost:3000')
        expect(true).to.equal(true)
    })
})
