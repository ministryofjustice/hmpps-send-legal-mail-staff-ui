import { Router } from 'express'
import auth from '../authentication/auth'
import tokenVerifier from '../data/tokenVerification'
import populateCurrentUser from './populateCurrentUser'
import type { Services } from '../services'
import populateCurrentUserRoles from './populateCurrentUserRoles'

export default function setUpCurrentUser({ userService, smokeTestStore }: Services): Router {
  const router = Router({ mergeParams: true })
  router.use(auth.authenticationMiddleware(tokenVerifier, smokeTestStore))
  router.use(populateCurrentUser(userService))
  router.use(populateCurrentUserRoles())
  return router
}
