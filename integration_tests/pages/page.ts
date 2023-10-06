export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  protected constructor(
    readonly pageId: string,
    private readonly options: { axeTest?: boolean } = {
      axeTest: true,
    },
  ) {
    this.checkOnPage()
    if (options.axeTest) {
      this.runAxe()
    }
  }

  checkOnPage = (): void => {
    cy.get('#pageId').should('have.attr', 'data-qa').should('equal', this.pageId)
  }

  runAxe = (): void => {
    cy.injectAxe()
    cy.checkA11y()
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  userName = (): PageElement => cy.get('[data-qa=header-user-name]')

  hasNoErrors = (): void => {
    cy.get('.govuk-error-summary__list').should('not.exist')
  }

  hasMainHeading = (expectedHeading: string): void => {
    cy.get('h1').should('contain.text', expectedHeading)
  }

  hasHeaderTitle = (expectedTitle: string): void => {
    cy.get('a[data-qa="header-text').should('contain.text', expectedTitle)
  }
}
