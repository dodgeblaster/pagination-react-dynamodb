describe('Pagination', () => {
    it('works!', () => {
        cy.visit('/')

        /**
         * Page 1
         * Click Next
         */
        cy.contains('Note 01')
        cy.contains('Back').should('be.disabled')
        cy.contains('Next').should('be.not.disabled').click()

        /**
         * Page 2
         * Click Back
         */
        cy.contains('Note 05')
        cy.contains('Back').should('not.be.disabled').click()
        cy.contains('Next').should('not.be.disabled')

        /**
         * Page 1
         * Click Next
         */
        cy.contains('Note 01')
        cy.contains('Back').should('be.disabled')
        cy.contains('Next').should('be.not.disabled').click()

        /**
         * Page 2
         * Click Next
         */
        cy.contains('Note 05')
        cy.contains('Back').should('not.be.disabled')
        cy.contains('Next').should('not.be.disabled').click()

        /**
         * Page 3
         * Click Next
         */
        cy.contains('Note 09')
        cy.contains('Back').should('not.be.disabled')
        cy.contains('Next').should('not.be.disabled').click()

        /**
         * Page 4
         * Last page
         */
        cy.contains('Note 15')
        cy.contains('Back').should('not.be.disabled')
        cy.contains('Next').should('be.disabled')
    })
})
