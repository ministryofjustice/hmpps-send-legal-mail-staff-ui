import { Router } from 'express'

import type { Services } from '../services'
import landingPageTiles from './landingPageTiles'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()

  router.get('/', (req, res, next) => {
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
