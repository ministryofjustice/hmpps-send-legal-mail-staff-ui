import express from 'express'

import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import { metricsMiddleware } from './monitoring/metricsApp'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import routes from './routes'
import type { Services } from './services'
import setupScanBarcode from './middleware/scan/setupScanBarcode'
import setupSupportedPrisons from './middleware/prisons/setupSupportedPrisons'
import setupSmokeTest from './middleware/smoketest/SmokeTestMiddleware'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(metricsMiddleware)
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app, services.applicationInfo)
  app.use(setupSmokeTest(services.smokeTestStore))
  app.use(setUpAuthentication())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))
  app.use(authorisationMiddleware(['ROLE_SLM_SCAN_BARCODE', 'ROLE_SLM_ADMIN']))
  app.use('/', setupScanBarcode(services.scanBarcodeService, services.prisonService, services.appInsightsService))
  app.use('/supported-prisons', setupSupportedPrisons(services.prisonService))
  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
