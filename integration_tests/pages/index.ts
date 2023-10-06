import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('index-page', { axeTest: true })
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  containsTile(tileTitle: string): IndexPage {
    this.tilesContainer().should('contain', tileTitle)
    return Page.verifyOnPage(IndexPage)
  }

  doesNotContainTile(tileTitle: string): IndexPage {
    this.tilesContainer().should('not.contain', tileTitle)
    return Page.verifyOnPage(IndexPage)
  }

  tilesContainer = (): PageElement => cy.get('ul.card-group')
}
