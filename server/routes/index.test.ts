import type { Express } from 'express'
import request from 'supertest'
import { JSDOM } from 'jsdom'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it(`should render index page with 'Scan barcodes' tile`, () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Scan barcodes')

        const doc = new JSDOM(res.text).window.document
        const link = doc.querySelector('a[href="/scan-barcode"]')
        expect(link.textContent).toContain('Scan barcodes')
      })
  })
})
