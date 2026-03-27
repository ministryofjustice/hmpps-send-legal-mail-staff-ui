import Page, { PageElement } from './page'

export default class AuthorisationErrorPage extends Page {
  constructor() {
    super('You are not authorised to access this service')
  }

  message = (): PageElement => cy.get('#main-content > p')
}
