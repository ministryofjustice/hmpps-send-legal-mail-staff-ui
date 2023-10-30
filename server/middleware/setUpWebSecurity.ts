import crypto from 'crypto'
import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import config from '../config'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })

  const scriptSrc = [
    "'self'",
    'https://*.hotjar.com',
    "'unsafe-inline'",
    '*.google-analytics.com',
    '*.googletagmanager.com',
    (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
  ]
  const styleSrc = [
    "'self'",
    'https://*.hotjar.com',
    "'unsafe-inline'",
    (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
  ]
  const imgSrc = ["'self'", 'data:', '*.google-analytics.com', '*.googletagmanager.com', 'https://*.hotjar.com']
  const fontSrc = ["'self'", 'https://*.hotjar.com']

  if (config.apis.frontendComponents.url) {
    scriptSrc.push(config.apis.frontendComponents.url)
    styleSrc.push(config.apis.frontendComponents.url)
    imgSrc.push(config.apis.frontendComponents.url)
    fontSrc.push(config.apis.frontendComponents.url)
  }

  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc,
          styleSrc,
          fontSrc,
          imgSrc,
          formAction: [`'self' ${config.apis.hmppsAuth.externalUrl} ${config.dpsUrl}`],
        },
      },
      crossOriginEmbedderPolicy: true,
    }),
  )
  return router
}
