import Error404Page from '../pages/error404'
import Page from '../pages/page'

context('404 Page Not Found', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  describe('Mail Room user', () => {
    it(`should show the 'page not found' page when authenticated as a mail room user and navigating to a non existent url`, () => {
      cy.task('stubAuthUser')
      cy.task('stubSignInWithRole_SLM_SCAN_BARCODE')
      cy.signIn()

      cy.visit('/manually-scan-the-barcodes', { failOnStatusCode: false })

      Page.verifyOnPage(Error404Page)
    })
  })
})
