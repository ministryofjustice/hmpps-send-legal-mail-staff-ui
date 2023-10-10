import Page, { PageElement } from './page'

export default class AuthorisationErrorPage extends Page {
  constructor() {
    super('auth-error')
  }

  message = (): PageElement => cy.get('#main-content > p')
}
