import Page from '../pages/page'
import ScanBarcodePage from '../pages/scan/scanBarcode'

context('Cookies', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubAuthToken')
  })

  describe('Scan barcode', () => {
    it('should not show cookie banner on internal pages', () => {
      cy.task('stubAuthUser')
      cy.task('stubSignInWithRole_SLM_SCAN_BARCODE')
      cy.signIn()
      cy.visit('/scan-barcode')

      const page = Page.verifyOnPage(ScanBarcodePage)
      page.doesntHaveCookieBanner()
    })
  })
})
