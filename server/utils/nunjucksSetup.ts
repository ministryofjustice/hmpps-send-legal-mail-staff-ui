/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks, { Environment } from 'nunjucks'
import express from 'express'
import initialiseNameFilter from '../filters/initialiseNameFilter'
import findErrorFilter from '../filters/findErrorFilter'
import calculateDaysSinceCreationFilter from '../filters/calculateDaysSinceCreationFilter'
import pageTitleInErrorFilter from '../filters/pageTitleInErrorFilter'
import formatDateFilter from '../filters/formatDateFilter'
import { ApplicationInfo } from '../applicationInfo'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Check Rule 39 Mail'

  // Cachebusting version string
  if (production) {
    // Version only changes with new commits
    app.locals.version = applicationInfo.gitShortHash
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  registerNunjucks(app)
}

export function registerNunjucks(app?: express.Express): Environment {
  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
      trimBlocks: true,
      lstripBlocks: true,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseNameFilter)
  njkEnv.addFilter('findError', findErrorFilter)
  njkEnv.addFilter('formatDate', formatDateFilter)
  njkEnv.addFilter('calculateDaysSinceCreation', calculateDaysSinceCreationFilter)
  njkEnv.addFilter('pageTitleInError', pageTitleInErrorFilter)

  njkEnv.addGlobal('contactHelpdeskBannerExcludedOnPages', [
    'auth-error',
    'contact-helpdesk',
    'contact-helpdesk-submitted',
  ])

  return njkEnv
}
