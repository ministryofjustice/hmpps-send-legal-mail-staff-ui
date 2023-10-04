import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(router: Router): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  return router
}
