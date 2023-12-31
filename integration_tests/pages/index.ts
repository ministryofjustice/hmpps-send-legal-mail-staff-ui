import Page, { PageElement } from './page'
import ScanBarcodePage from './scan/scanBarcode'

export default class IndexPage extends Page {
  constructor() {
    super('index-page', { axeTest: true })
  }

  fallbackHeaderUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  containsTile(tileTitle: string): IndexPage {
    this.tilesContainer().should('contain', tileTitle)
    return Page.verifyOnPage(IndexPage)
  }

  doesNotContainTile(tileTitle: string): IndexPage {
    this.tilesContainer().should('not.contain', tileTitle)
    return Page.verifyOnPage(IndexPage)
  }

  clickScanBarcodeTile(): ScanBarcodePage {
    this.tilesContainer().find('div.card[data-test=scan-barcode] a').click()
    return Page.verifyOnPage(ScanBarcodePage)
  }

  tilesContainer = (): PageElement => cy.get('ul.card-group')
}
