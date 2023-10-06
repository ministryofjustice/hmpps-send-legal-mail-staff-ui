import IndexPage from './pages/index'
import Page from './pages/page'

context('Index Page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('DPS user with SLM_SCAN_BARCODE role does see tile', () => {
    cy.task('stubSignInWithRole_SLM_SCAN_BARCODE')
    cy.signIn()

    Page.verifyOnPage(IndexPage).containsTile('Check Rule 39 mail')
  })

  it('DPS user without SLM_SCAN_BARCODE role does not see tile', () => {
    cy.task('stubSignInWithRole_SLM_ADMIN')
    cy.signIn()

    Page.verifyOnPage(IndexPage).doesNotContainTile('Check Rule 39 mail')
  })
})