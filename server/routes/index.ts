import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import landingPageTiles from './landingPageTiles'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    if (res.locals.breadcrumbs) {
      res.locals.breadcrumbs.popLastItem()
    }

    res.render('pages/index', {
      tiles: landingPageTiles.filter(tile =>
        tile.roles.some(requiredRole => res.locals.user?.roles.includes(requiredRole)),
      ),
    })
  })

  return router
}
