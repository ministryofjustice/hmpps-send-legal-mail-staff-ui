import Page from '../pages/page'
import AuthorisationErrorPage from '../pages/authorisationError'
import ManualBarcodeEntryPage from '../pages/scan/manualBarcodeEntry'
import ScanBarcodeResultPage from '../pages/scan/scanBarcodeResult'

context('Manual Barcode Entry Page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubManageUser')
    cy.task('stubGetPrisonRegister')
  })

  it('Logged in user with SLM_SCAN_BARCODE role can navigate to manual barcode entry page', () => {
    cy.task('stubSignInWithRole_SLM_SCAN_BARCODE')
    cy.signIn()

    cy.visit('/manually-enter-barcode')

    Page.verifyOnPage(ManualBarcodeEntryPage)
  })

  it('Logged in user with SLM_ADMIN role can not navigate to manual barcode entry page', () => {
    cy.task('stubSignInWithRole_SLM_ADMIN')
    cy.signIn()

    cy.visit('/manually-enter-barcode', { failOnStatusCode: false })

    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('Unauthenticated user can not navigate to manual barcode entry page', () => {
    // This is a terrible test - unauthenticated users get a 404 page rather than a 401 which seems to be an express thing
    // plus express returns content-type: text/plain for a 404 page (unless defined with a specific error route handler and view rendering)
    // which means cypress fails because it expects cy.visit calls to return text/html
    // TODO - implement 401 and 404 handlers with appropriate views; configure express to return a 401 for valid page routes when unauthenticated
    // and make this test better!
    // (also note our current /autherror handler returns a 401 - this perhaps should be a 403 ?)
    cy.request({ url: '/manually-enter-barcode', failOnStatusCode: false }).its('status').should('equal', 404)
  })

  it('should render barcode results page given form submitted with barcode that verifies as OK', () => {
    cy.task('stubVerifyValidBarcode')
    cy.task('stubSignInWithRole_SLM_SCAN_BARCODE')
    cy.signIn()
    cy.visit('/manually-enter-barcode')
    const manualBarcodeEntryPage = Page.verifyOnPage(ManualBarcodeEntryPage)

    const scanBarcodeResultPage: ScanBarcodeResultPage = manualBarcodeEntryPage.submitFormWithValidBarcode()

    scanBarcodeResultPage.hasMainHeading('Ready for final delivery')
  })

  it('should render barcode results page given form submitted with barcode that has been already scanned before', () => {
    cy.task('stubVerifyDuplicateBarcode')
    cy.task('stubSignInWithRole_SLM_SCAN_BARCODE')
    cy.signIn()
    cy.visit('/manually-enter-barcode')
    const manualBarcodeEntryPage = Page.verifyOnPage(ManualBarcodeEntryPage)

    const scanBarcodeResultPage: ScanBarcodeResultPage =
      manualBarcodeEntryPage.submitFormWithBarcodeThatHasBeenScannedPreviously()

    scanBarcodeResultPage.hasMainHeading('Barcode already scanned: carry out further checks')
  })

  it('should render barcode results page given form submitted with barcode that cannot be found', () => {
    cy.task('stubVerifyNotFoundBarcode')
    cy.task('stubSignInWithRole_SLM_SCAN_BARCODE')
    cy.signIn()
    cy.visit('/manually-enter-barcode')
    const manualBarcodeEntryPage = Page.verifyOnPage(ManualBarcodeEntryPage)

    const scanBarcodeResultPage: ScanBarcodeResultPage = manualBarcodeEntryPage.submitFormWithBarcodeThatDoesNotExist()

    scanBarcodeResultPage.hasMainHeading('Barcode not recognised: carry out further checks')
  })

  it('should render barcode results given user indicates they cannot enter the barcode', () => {
    cy.task('stubSignInWithRole_SLM_SCAN_BARCODE')
    cy.signIn()
    cy.visit('/manually-enter-barcode')
    const manualBarcodeEntryPage = Page.verifyOnPage(ManualBarcodeEntryPage)

    manualBarcodeEntryPage.problemEnteringBarcode()

    Page.verifyOnPage(ScanBarcodeResultPage)
  })
})
