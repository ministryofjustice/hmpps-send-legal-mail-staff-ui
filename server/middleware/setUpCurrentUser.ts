import { Router } from 'express'
import populateCurrentUser from './populateCurrentUser'
import type { Services } from '../services'
import populateCurrentUserRoles from './populateCurrentUserRoles'

export default function setUpCurrentUser({ userService }: Services): Router {
  const router = Router({ mergeParams: true })
  router.use(populateCurrentUser(userService))
  router.use(populateCurrentUserRoles())
  return router
}
